#!/usr/bin/env node

import {
  AutoCompleteType,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import Anthropic from "@anthropic-ai/sdk";
import { Command } from "commander";
import {
  translateCategory,
  generateAutocompleteFiles,
} from "./categories-translation";
import { analyze } from "./analyze-categories";
import { getCategoryLabel } from "../utils/search-suggestions.utils";
import { searchSuggestionsService } from "../search-suggestions.service";

/**
 * Fonction cleanup - Supprime les catégories obsolètes
 */
async function cleanup(): Promise<void> {
  console.log("🗑️  Cleaning up obsolete categories...\n");

  const analysisResult = analyze();

  const obsoleteEntries = analysisResult.extraEntries || [];

  if (obsoleteEntries.length === 0) {
    console.log("✅ No obsolete categories to remove\n");
    return;
  }

  console.log(`\nFound ${obsoleteEntries.length} obsolete entries\n`);

  // Grouper par catégorie
  const obsoleteByCategory: Record<string, number> = {};
  for (const entry of obsoleteEntries) {
    const categoryId = entry.categoryId as string;
    obsoleteByCategory[categoryId] = (obsoleteByCategory[categoryId] || 0) + 1;
  }

  console.log("Obsolete categories to be deleted:");
  for (const [categoryId, count] of Object.entries(obsoleteByCategory)) {
    console.log(`  - ${categoryId}: ${count} entries`);
  }
  console.log("");

  console.log("=".repeat(60));
  console.log("⚠️  Press Ctrl+C to cancel, or wait 5 seconds to proceed...");
  console.log("=".repeat(60));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("");

  // Supprimer par pays/lang
  const byCountryLang: Record<string, string[]> = {};
  for (const entry of obsoleteEntries) {
    const key = `${entry.country}:${entry.lang}`;
    if (!byCountryLang[key]) {
      byCountryLang[key] = [];
    }
    byCountryLang[key].push(entry.categoryId as string);
  }

  let totalDeleted = 0;
  for (const [key, categoryIds] of Object.entries(byCountryLang)) {
    const [country, lang] = key.split(":");
    const deleted = await searchSuggestionsService.removeSourceEntries(
      country as SoliguideCountries,
      lang as SupportedLanguagesCode,
      categoryIds
    );
    totalDeleted += deleted;
  }

  console.log(`✅ Deleted ${totalDeleted} obsolete entries\n`);

  console.log("📦 Regenerating JSON files...\n");
  await generateAutocompleteFiles();

  console.log("\n✅ Cleanup complete!\n");
}

/**
 * Fonction sync - Synchronisation complète
 */
async function sync(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("❌ ANTHROPIC_API_KEY is not set");
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log("🔄 Starting full synchronization...\n");

  const analysisResult = analyze();

  console.log("=".repeat(60));
  console.log("Press Ctrl+C to cancel, or wait 3 seconds to continue...");
  console.log("=".repeat(60));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("\n");

  // Étape 1: Créer les entrées manquantes
  console.log("📋 Step 1: Creating missing entries...\n");

  let created = 0;
  for (const entry of analysisResult.missingEntries) {
    const label = getCategoryLabel(
      entry.categoryId,
      entry.lang as SupportedLanguagesCode
    );

    await searchSuggestionsService.addSourceEntry(
      entry.country as SoliguideCountries,
      entry.lang as SupportedLanguagesCode,
      {
        label,
        categoryId: entry.categoryId as any,
        slug: entry.categoryId,
        synonyms: [],
        type: AutoCompleteType.CATEGORY,
        lang: entry.lang as SupportedLanguagesCode,
        country: entry.country as SoliguideCountries,
        seoTitle: "",
        seoDescription: "",
      }
    );

    created++;
    console.log(`  ✅ Created: ${entry.sourceId} (${entry.lang}: ${label})`);
  }

  if (created > 0) {
    console.log(`\n📊 Created ${created} new entries\n`);
  } else {
    console.log(`\n✅ No new entries to create\n`);
  }

  // Étape 2: Traduire toutes les entrées sans seoTitle ou seoDescription
  console.log("🌍 Step 2: Translating entries...\n");

  const toTranslateRefreshed =
    searchSuggestionsService.getUntranslatedSourceCategories();

  let translated = 0;
  let errors = 0;

  if (toTranslateRefreshed.length === 0) {
    console.log("✅ All entries already have translations\n");
  } else {
    console.log(`📝 Translating ${toTranslateRefreshed.length} entries...\n`);

    for (const entry of toTranslateRefreshed) {
      console.log(
        `  [${translated + errors + 1}/${toTranslateRefreshed.length}] ${
          entry.label
        } (${entry.country}-${entry.lang})`
      );

      try {
        const result = await translateCategory(
          {
            ...entry,
            sourceId: entry.categoryId as string,
            content: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          anthropic
        );

        await searchSuggestionsService.updateSourceEntry(
          entry.country as SoliguideCountries,
          entry.lang as SupportedLanguagesCode,
          entry.categoryId as string,
          {
            seoTitle: result.seoTitle,
            seoDescription: result.seoDescription,
            synonyms: result.synonyms,
          }
        );

        translated++;
        console.log(`    ✅ Translated`);

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        errors++;
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`    ❌ Error: ${errorMessage}`);
      }
    }

    console.log(
      `\n📊 Translation complete: ${translated} success, ${errors} errors\n`
    );
  }

  // Étape 3: Supprimer les catégories obsolètes
  console.log("🗑️  Step 3: Removing obsolete categories...\n");

  const obsoleteEntries = analysisResult.extraEntries || [];
  let deleted = 0;

  if (obsoleteEntries.length > 0) {
    console.log(`Found ${obsoleteEntries.length} obsolete entries to remove\n`);

    const obsoleteByCategory: Record<string, number> = {};
    for (const entry of obsoleteEntries) {
      const categoryId = entry.categoryId as string;
      obsoleteByCategory[categoryId] =
        (obsoleteByCategory[categoryId] || 0) + 1;
    }

    console.log("Obsolete categories:");
    for (const [categoryId, count] of Object.entries(obsoleteByCategory)) {
      console.log(`  - ${categoryId}: ${count} entries`);
    }
    console.log("");

    const byCountryLang: Record<string, string[]> = {};
    for (const entry of obsoleteEntries) {
      const key = `${entry.country}:${entry.lang}`;
      if (!byCountryLang[key]) {
        byCountryLang[key] = [];
      }
      byCountryLang[key].push(entry.categoryId as string);
    }

    for (const [key, categoryIds] of Object.entries(byCountryLang)) {
      const [country, lang] = key.split(":");
      const removed = await searchSuggestionsService.removeSourceEntries(
        country as SoliguideCountries,
        lang as SupportedLanguagesCode,
        categoryIds
      );
      deleted += removed;
    }

    console.log(`✅ Deleted ${deleted} obsolete entries\n`);
  } else {
    console.log("✅ No obsolete entries to remove\n");
  }

  // Étape 4: Exporter les fichiers JSON
  console.log("📦 Step 4: Exporting JSON files...\n");

  await generateAutocompleteFiles();

  console.log("\n✅ Synchronization complete!\n");
  console.log("=".repeat(60));
  console.log("📊 FINAL SUMMARY");
  console.log("=".repeat(60));
  console.log(`Created: ${created} entries`);
  console.log(
    `Translated: ${
      toTranslateRefreshed.length > 0
        ? `${translated} entries`
        : "0 entries (none needed)"
    }`
  );
  console.log(`Deleted: ${deleted} obsolete entries`);
  console.log(`Errors: ${toTranslateRefreshed.length > 0 ? errors : 0}`);
  console.log("=".repeat(60));
}

// CLI
const program = new Command();

program
  .name("sync-categories")
  .description("Synchronize and translate Soliguide categories")
  .version("1.0.0");

program
  .command("sync")
  .description(
    "Full synchronization: create missing entries, translate, and export"
  )
  .action(async () => {
    try {
      await sync();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program
  .command("analyze")
  .description("Analyze JSON source files without making changes")
  .action(async () => {
    try {
      analyze();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program
  .command("cleanup")
  .description("Remove obsolete categories and regenerate files")
  .action(async () => {
    try {
      await cleanup();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program.addHelpText(
  "after",
  `
Examples:
  # Analyze current state
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts analyze

  # Full synchronization
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts sync

  # Remove obsolete categories
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts cleanup
`
);

program.parse(process.argv);
