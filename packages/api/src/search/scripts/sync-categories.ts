#!/usr/bin/env node
/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AutoCompleteType,
  Categories,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SearchSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import Anthropic from "@anthropic-ai/sdk";
import { Command } from "commander";
import { connectToDatabase } from "../../config/database";
import { generateAutocompleteFiles } from "./generate-categories-json";
import { LANGUAGE_NAMES } from "./constants";
import {
  SERVICE_CATEGORIES_API_FR,
  SERVICE_CATEGORIES_API_ES,
  SERVICE_CATEGORIES_API_AD,
} from "../../categories/constants/service-categories.const";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ModelWithId } from "../../_models/mongo/types/ModelWithId.type";

/**
 * Cache for translations
 */
const translationsCache: Record<string, Record<string, string>> = {};

/**
 * Helper: Load translations for a language
 */
const loadTranslations = (
  lang: SupportedLanguagesCode
): Record<string, string> => {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    const translationPath = join(
      __dirname,
      "../../../common/dist/cjs/translations/locales",
      `${lang}.json`
    );
    const content = readFileSync(translationPath, "utf-8");
    translationsCache[lang] = JSON.parse(content);
    return translationsCache[lang];
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return {};
  }
};

/**
 * Helper: Get translated label for a category
 */
const getCategoryLabel = (
  categoryId: string,
  lang: SupportedLanguagesCode
): string => {
  const translations = loadTranslations(lang);
  const key = `CAT_${categoryId.toUpperCase()}`;
  return translations[key] || categoryId;
};

/**
 * Helper: Get country flag emoji
 */
const getCountryFlag = (country: SoliguideCountries): string => {
  switch (country) {
    case "fr":
      return "🇫🇷";
    case "es":
      return "🇪🇸";
    case "ad":
      return "🇦🇩";
    default:
      return "🏳️";
  }
};

/**
 * Helper: Get categories service by country
 */
const getCategoriesServiceByCountry = (country: SoliguideCountries) => {
  switch (country) {
    case "fr":
      return SERVICE_CATEGORIES_API_FR;
    case "es":
      return SERVICE_CATEGORIES_API_ES;
    case "ad":
      return SERVICE_CATEGORIES_API_AD;
    default:
      throw new Error(`Unknown country: ${country}`);
  }
};

/**
 * Helper: Get all category IDs for a country
 */
const getCategoryIdsForCountry = (
  country: SoliguideCountries
): Categories[] => {
  const service = getCategoriesServiceByCountry(country);
  return service.getCategories().map((cat) => cat.id);
};

/**
 * Types
 */
interface MissingEntry {
  categoryKey: string;
  categoryId: string;
  country: string;
  lang: string;
  sourceId: string;
}

interface ContentQualityIssue {
  entry: SearchSuggestion;
  issues: string[];
}

interface ContentQualityByCountry {
  country: SoliguideCountries;
  totalEntries: number;
  missingSeoTitle: number;
  missingSeoDescription: number;
  insufficientSynonyms: number;
  entriesWithIssues: ContentQualityIssue[];
}

interface AnalysisResult {
  totalCategories: number;
  existingEntries: ModelWithId<SearchSuggestion>[];
  missingEntries: MissingEntry[];
  entriesToTranslate: ModelWithId<SearchSuggestion>[];
  extraEntries?: ModelWithId<SearchSuggestion>[];
  expectedTotal?: number;
  contentQuality?: ContentQualityByCountry[];
}

interface TranslationResult {
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
}

/**
 * Fonction translateCategory - Génère les traductions avec Claude
 * (réutilise la logique existante de generate-categories-autocomplete.ts)
 */
async function translateCategory(
  suggestion: SearchSuggestion,
  anthropic: Anthropic
): Promise<TranslationResult> {
  const prompt = buildPrompt(suggestion);

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response format");
  }

  const jsonText = content.text.trim();
  return parseResponse(jsonText, suggestion);
}

/**
 * Fonction buildPrompt - Construit le prompt détaillé
 * (réutilise la logique existante)
 */
function buildPrompt(suggestion: SearchSuggestion): string {
  const { label, country, lang, type } = suggestion;
  const language = LANGUAGE_NAMES[lang];
  const needsSynonyms = type === AutoCompleteType.CATEGORY;

  const getContentTypeContext = (type: AutoCompleteType): string => {
    const contexts: { [key in AutoCompleteType]?: string } = {
      [AutoCompleteType.ORGANIZATION]: "ORGANISME spécifique",
      [AutoCompleteType.ESTABLISHMENT_TYPE]: "TYPE D'ÉTABLISSEMENT",
      [AutoCompleteType.CATEGORY]: "CATÉGORIE d'aide sociale",
    };
    const context = contexts[type] || "RECHERCHE LIBRE";
    const usage =
      type === AutoCompleteType.CATEGORY
        ? "utilisateurs cherchent de l'aide dans ce domaine"
        : type === AutoCompleteType.ORGANIZATION ||
          type === AutoCompleteType.ESTABLISHMENT_TYPE
        ? "utilisateurs cherchent ce lieu près de chez eux"
        : "informations sur ce sujet";

    return `${context} (${label}) - ${usage}`;
  };

  const jsonFormat = needsSynonyms
    ? `{
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Description 150-160 chars",
  "synonyms": ["terme1", "terme2"]
}`
    : `{
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Description 150-160 chars"
}`;

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PARAMÈTRES OBLIGATOIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYS: ${country}
LANGUE: ${language} (${lang})
ÉLÉMENT: "${label}"
TYPE: ${getContentTypeContext(type)}

⚠️ CRITIQUE: TOUT le JSON doit être en ${language}, aucune autre langue acceptée.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUBLIC: Personnes précaires, sans-abri, réfugiés, professionnels sociaux en ${country}

📋 NORME OBLIGATOIRE: ISO 24495-1:2023 - Langage clair et simple
- Phrases courtes (max 22 mots), mots simples
- Ton bienveillant, "vous", sans jargon ni stigmatisation
- Exemples concrets et locaux (${country})

CONSIGNES SEO:
1. TITRE (empathique, non commercial)
   • Inclure "${label}" + "Soliguide" naturellement
   • Pas de ":" ni majuscule en milieu de phrase

2. DESCRIPTION (150-160 caractères)
   • Inclure "Soliguide"
   • 3 exemples concrets d'aide en ${country}
${
  needsSynonyms
    ? `
3. SYNONYMES (15 mots en ${language})
   • Termes concrets illustrant le service
   • Pas de répétition (ex: repos, reposer → une seule forme)
   • Éviter: social, aide, accompagnement (trop génériques)
   • Ex. accueil: cafe repos parler femme harcelement discuter rencontrer`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLES (à adapter en ${language}):

Titres:
- "Trouvez des soins gratuits avec Soliguide"
- "Face à l'addiction, ne restez plus seuls. Découvrez les lieux d'aide sur Soliguide"

Descriptions:
- "Soliguide vous propose des centaines de lieux pour manger, obtenir un colis alimentaire ou des chèques alimentation"
${
  needsSynonyms
    ? `
Synonymes:
- Espace de repos: reposer dormir repos pause`
    : ""
}

Établissements ${country}:
- "CCAS pour votre domiciliation"
- "Maison de santé près de chez vous"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ JSON 100% en ${language} | ✓ Exemples locaux ${country} | ✓ ISO 24495-1:2023

${jsonFormat}

RÉPONDS UNIQUEMENT AVEC LE JSON. COMMENCE PAR { ET TERMINE PAR }`;
}

/**
 * Fonction parseResponse - Parse la réponse de Claude
 */
function parseResponse(
  text: string,
  suggestion: SearchSuggestion
): TranslationResult {
  let cleanText = text.trim();
  cleanText = cleanText.replaceAll(/```json\s*|```\s*/g, "");

  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error("Invalid JSON format - braces missing");
  }

  const jsonText = cleanText.substring(firstBrace, lastBrace + 1);
  const parsed = JSON.parse(jsonText);

  if (!parsed.seoTitle || !parsed.seoDescription) {
    throw new Error("Missing required fields (seoTitle and seoDescription)");
  }

  const result: TranslationResult = {
    seoTitle: parsed.seoTitle.trim() as string,
    seoDescription: parsed.seoDescription.trim() as string,
    synonyms: [],
  };

  if (suggestion.type === AutoCompleteType.CATEGORY) {
    if (!parsed.synonyms || !Array.isArray(parsed.synonyms)) {
      throw new Error(
        "Synonyms are required and must be an array for categories"
      );
    }
    result.synonyms = parsed.synonyms.filter(
      (s: unknown): s is string => typeof s === "string" && s.trim().length > 0
    );
  } else {
    result.synonyms = suggestion.synonyms || [];
  }

  return result;
}

/**
 * Fonction analyze - Analyse la base de données sans faire de modifications
 */
async function analyze(): Promise<AnalysisResult> {
  console.log("🔍 Analysis: Scanning database and taxonomy...\n");

  const existingEntries: ModelWithId<SearchSuggestion>[] =
    await SearchSuggestionModel.find({
      type: AutoCompleteType.CATEGORY,
    });

  console.log("📋 Sample entries from DB (first 5):");
  for (const entry of existingEntries.slice(0, 5)) {
    console.log(
      `  - ${entry.categoryId} | ${entry.country}-${entry.lang} | label: ${entry.label}`
    );
  }
  console.log("");

  // Créer un Set avec la vraie clé unique : categoryId-country-lang
  const existingKeys = new Set(
    existingEntries.map((e) => `${e.categoryId}-${e.country}-${e.lang}`)
  );

  // Calculer toutes les entrées attendues et les entrées manquantes
  const expectedSourceIds = new Set<string>();
  const missingEntries: MissingEntry[] = [];
  let totalExpected = 0;

  // Pour chaque pays, on récupère SES catégories attendues
  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const categoryIdsForCountry = getCategoryIdsForCountry(country);
    const countryLanguages = SUPPORTED_LANGUAGES_BY_COUNTRY[country];
    const languages = [
      countryLanguages.source,
      ...countryLanguages.otherLanguages,
    ];

    for (const categoryId of categoryIdsForCountry) {
      const categoryKey =
        Object.keys(Categories).find(
          (key) => Categories[key as keyof typeof Categories] === categoryId
        ) || categoryId;

      for (const lang of languages) {
        const uniqueKey = `${categoryId}-${country}-${lang}`;
        expectedSourceIds.add(uniqueKey);
        totalExpected++;

        if (!existingKeys.has(uniqueKey)) {
          missingEntries.push({
            categoryKey,
            categoryId,
            country,
            lang,
            sourceId: categoryId, // Le vrai sourceId en DB est juste le categoryId
          });
        }
      }
    }
  }

  // Calculer les entrées en trop (dans la DB mais pas dans les catégories attendues pour ce pays)
  const extraEntries = existingEntries.filter((entry) => {
    const categoryIdsForCountry = getCategoryIdsForCountry(
      entry.country as SoliguideCountries
    );
    return !categoryIdsForCountry.includes(entry.categoryId as Categories);
  });

  // Calculer ce qui doit être traduit
  const entriesToTranslate = await SearchSuggestionModel.find({
    type: AutoCompleteType.CATEGORY,
    $or: [
      { seoTitle: "" },
      { seoTitle: { $exists: false } },
      { seoDescription: "" },
      { seoDescription: { $exists: false } },
    ],
  });

  // Analyser la qualité du contenu
  console.log("🔍 Analyzing content quality...\n");
  const contentQuality: ContentQualityByCountry[] = [];

  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const entriesForCountry = existingEntries.filter(
      (e) => e.country === country
    );
    const entriesWithIssues: ContentQualityIssue[] = [];
    let missingSeoTitle = 0;
    let missingSeoDescription = 0;
    let insufficientSynonyms = 0;

    for (const entry of entriesForCountry) {
      const issues: string[] = [];

      // Vérifier seoTitle
      if (!entry.seoTitle || entry.seoTitle.trim() === "") {
        issues.push("Missing seoTitle");
        missingSeoTitle++;
      }

      // Vérifier seoDescription
      if (!entry.seoDescription || entry.seoDescription.trim() === "") {
        issues.push("Missing seoDescription");
        missingSeoDescription++;
      }

      // Vérifier synonyms (doit avoir au moins 2 synonymes)
      if (!entry.synonyms || entry.synonyms.length < 2) {
        issues.push(
          `Insufficient synonyms (${entry.synonyms?.length || 0}, need ≥2)`
        );
        insufficientSynonyms++;
      }

      if (issues.length > 0) {
        entriesWithIssues.push({ entry, issues });
      }
    }

    contentQuality.push({
      country,
      totalEntries: entriesForCountry.length,
      missingSeoTitle,
      missingSeoDescription,
      insufficientSynonyms,
      entriesWithIssues,
    });
  }

  // Afficher le résumé
  displayAnalysisResult({
    totalCategories: Object.keys(Categories).length,
    existingEntries,
    missingEntries,
    entriesToTranslate,
    extraEntries,
    expectedTotal: totalExpected,
    contentQuality,
  });

  return {
    totalCategories: Object.keys(Categories).length,
    existingEntries,
    missingEntries,
    entriesToTranslate,
    extraEntries,
    contentQuality,
  };
}

/**
 * Fonction displayAnalysisResult - Affiche le résultat de l'analyse
 */
function displayAnalysisResult(result: AnalysisResult): void {
  console.log("=".repeat(80));
  console.log("📊 ANALYSIS SUMMARY - CATEGORIES ONLY");
  console.log(
    "(Organizations & Establishments are managed in DB only, not analyzed here)"
  );
  console.log("=".repeat(80));
  console.log(`Total categories in enum: ${result.totalCategories}`);
  console.log(
    `Expected total entries: ${result.expectedTotal || "calculating..."}`
  );
  console.log(`Existing entries in DB: ${result.existingEntries.length}`);
  console.log(`Missing entries: ${result.missingEntries.length}`);
  console.log(`Extra entries (obsolete): ${result.extraEntries?.length || 0}`);
  console.log(
    `Entries needing translation: ${result.entriesToTranslate.length}`
  );
  console.log("=".repeat(80));

  // Construire le tableau par pays
  console.log("\n📍 BREAKDOWN BY COUNTRY:\n");

  // Grouper les données par pays
  const existingByCountry: Record<string, number> = {};
  const missingByCountry: Record<string, number> = {};
  const toTranslateByCountry: Record<string, number> = {};
  const obsoleteByCountry: Record<string, number> = {};
  const newCategoriesByCountry: Record<string, number> = {};

  // Compter les VRAIES entrées existantes par pays depuis la DB
  for (const country of Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY)) {
    existingByCountry[country] = 0;
    newCategoriesByCountry[country] = 0;
  }
  for (const entry of result.existingEntries) {
    existingByCountry[entry.country] =
      (existingByCountry[entry.country] || 0) + 1;
  }

  // Compter les manquantes par pays
  for (const entry of result.missingEntries) {
    missingByCountry[entry.country] =
      (missingByCountry[entry.country] || 0) + 1;
  }

  // Compter les à traduire par pays
  for (const entry of result.entriesToTranslate) {
    toTranslateByCountry[entry.country] =
      (toTranslateByCountry[entry.country] || 0) + 1;
  }

  // Compter les catégories obsolètes par pays
  if (result.extraEntries) {
    for (const entry of result.extraEntries) {
      obsoleteByCountry[entry.country] =
        (obsoleteByCountry[entry.country] || 0) + 1;
    }
  }

  // Compter les nouvelles catégories (celles qui n'ont AUCUNE entrée en DB pour ce pays)
  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const categoryIdsForCountry = getCategoryIdsForCountry(country);
    const existingCategoriesForCountry = new Set(
      result.existingEntries
        .filter((e) => e.country === country)
        .map((e) => e.categoryId)
    );

    for (const categoryId of categoryIdsForCountry) {
      if (!existingCategoriesForCountry.has(categoryId)) {
        newCategoriesByCountry[country] =
          (newCategoriesByCountry[country] || 0) + 1;
      }
    }
  }

  // Créer le tableau
  const tableData = Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY).map(
    (country) => {
      const countryCode = country as SoliguideCountries;
      const countryLangs = SUPPORTED_LANGUAGES_BY_COUNTRY[countryCode];
      const langCount = 1 + countryLangs.otherLanguages.length;
      const categoriesCount = getCategoryIdsForCountry(countryCode).length;
      const expected = categoriesCount * langCount;
      const existing = existingByCountry[country] || 0;
      const missing = missingByCountry[country] || 0;
      const obsolete = obsoleteByCountry[country] || 0;
      const newCategories = newCategoriesByCountry[country] || 0;
      const toTranslate = toTranslateByCountry[country] || 0;

      return {
        Country: `${getCountryFlag(countryCode)} ${country.toUpperCase()}`,
        Categories: categoriesCount,
        Languages: langCount,
        Expected: expected,
        Existing: existing,
        Missing: missing,
        "New Cat.": newCategories,
        Obsolete: obsolete,
        "To Translate": toTranslate,
      };
    }
  );

  console.table(tableData);

  // Afficher la qualité du contenu
  if (result.contentQuality && result.contentQuality.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("📝 CONTENT QUALITY ANALYSIS");
    console.log("=".repeat(80));

    const qualityTable = result.contentQuality.map((quality) => ({
      Country: `${getCountryFlag(
        quality.country
      )} ${quality.country.toUpperCase()}`,
      Total: quality.totalEntries,
      "Missing seoTitle": quality.missingSeoTitle,
      "Missing seoDesc": quality.missingSeoDescription,
      "Insuff. synonyms": quality.insufficientSynonyms,
      "% Issues": `${(
        (quality.entriesWithIssues.length / quality.totalEntries) *
        100
      ).toFixed(1)}%`,
    }));

    console.table(qualityTable);
  }

  // Affichage détaillé par pays
  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`${getCountryFlag(country)} COUNTRY: ${country.toUpperCase()}`);
    console.log("=".repeat(80));

    // Catégories manquantes pour ce pays
    const missingForCountry = result.missingEntries.filter(
      (e) => e.country === country
    );
    if (missingForCountry.length > 0) {
      console.log("\n🆕 MISSING CATEGORIES:");

      // Grouper par catégorie
      const byCategory: Record<string, string[]> = {};
      for (const entry of missingForCountry) {
        if (!byCategory[entry.categoryId]) {
          byCategory[entry.categoryId] = [];
        }
        byCategory[entry.categoryId].push(entry.lang);
      }

      // Afficher chaque catégorie sur une ligne
      for (const [categoryId, langs] of Object.entries(byCategory)) {
        const categoryKey = Object.keys(Categories).find(
          (key) => Categories[key as keyof typeof Categories] === categoryId
        );
        console.log(
          `  - ${categoryKey || categoryId}: ${langs.join(", ")} (${
            langs.length
          } languages)`
        );
      }
    } else {
      console.log("\n✅ No missing categories");
    }

    // Catégories obsolètes pour ce pays
    const obsoleteForCountry = result.extraEntries?.filter(
      (e) => e.country === country
    );
    if (obsoleteForCountry && obsoleteForCountry.length > 0) {
      console.log("\n🗑️  OBSOLETE CATEGORIES:");

      // Grouper par catégorie
      const byCategory: Record<string, { langs: string[]; label: string }> = {};
      for (const entry of obsoleteForCountry) {
        const categoryId = entry.categoryId as string;
        if (!byCategory[categoryId]) {
          byCategory[categoryId] = { langs: [], label: entry.label };
        }
        byCategory[categoryId].langs.push(entry.lang);
      }

      // Afficher chaque catégorie sur une ligne
      for (const [categoryId, info] of Object.entries(byCategory)) {
        console.log(
          `  - ${categoryId} (${info.label}): ${info.langs.join(", ")} (${
            info.langs.length
          } entries)`
        );
      }
    } else {
      console.log("\n✅ No obsolete categories");
    }

    // Afficher les problèmes de qualité du contenu
    const qualityForCountry = result.contentQuality?.find(
      (q) => q.country === country
    );
    if (qualityForCountry && qualityForCountry.entriesWithIssues.length > 0) {
      console.log("\n⚠️  CONTENT QUALITY ISSUES:");
      console.log(
        `  Total: ${qualityForCountry.entriesWithIssues.length}/${qualityForCountry.totalEntries} entries have issues\n`
      );

      // Grouper par catégorie
      const issuesByCategory: Record<
        string,
        { langs: string[]; issues: Set<string> }
      > = {};

      for (const { entry, issues } of qualityForCountry.entriesWithIssues) {
        const categoryId = entry.categoryId as string;
        if (!issuesByCategory[categoryId]) {
          issuesByCategory[categoryId] = { langs: [], issues: new Set() };
        }
        issuesByCategory[categoryId].langs.push(entry.lang);
        issues.forEach((issue) =>
          issuesByCategory[categoryId].issues.add(issue)
        );
      }

      // Afficher les 10 premières catégories avec le plus de problèmes
      const sortedCategories = Object.entries(issuesByCategory).sort(
        (a, b) => b[1].langs.length - a[1].langs.length
      );

      console.log("  Top categories with issues:");
      for (const [categoryId, info] of sortedCategories.slice(0, 10)) {
        const categoryKey =
          Object.keys(Categories).find(
            (key) => Categories[key as keyof typeof Categories] === categoryId
          ) || categoryId;
        console.log(
          `    - ${categoryKey}: ${info.langs.length} lang(s) - ${Array.from(
            info.issues
          ).join(", ")}`
        );
      }

      if (sortedCategories.length > 10) {
        console.log(`    ... and ${sortedCategories.length - 10} more`);
      }
    } else if (qualityForCountry) {
      console.log("\n✅ All entries have good content quality");
    }
  }

  console.log("");
}

/**
 * Fonction clean - Vide toutes les traductions
 */
async function clean(): Promise<void> {
  console.log("🧹 Cleaning all translations...\n");

  const result = await SearchSuggestionModel.updateMany(
    { type: AutoCompleteType.CATEGORY },
    {
      $set: {
        seoTitle: "",
        seoDescription: "",
        synonyms: [],
      },
    }
  );

  console.log(`✅ Cleaned ${result.modifiedCount} entries\n`);
}

/**
 * Fonction cleanup - Supprime les catégories obsolètes
 */
async function cleanup(): Promise<void> {
  console.log("🗑️  Cleaning up obsolete categories...\n");

  // Analyser pour trouver les obsolètes
  const analysisResult = await analyze();

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

  // Supprimer
  const obsoleteIds = obsoleteEntries.map((e) => e._id);
  const deleteResult = await SearchSuggestionModel.deleteMany({
    _id: { $in: obsoleteIds },
  });

  const deleted = deleteResult.deletedCount || 0;
  console.log(`✅ Deleted ${deleted} obsolete entries\n`);

  // Régénérer les fichiers JSON
  console.log("📦 Regenerating JSON files...\n");
  await generateAutocompleteFiles();

  console.log("\n✅ Cleanup complete!\n");
  console.log("💡 Next step: Create MongoDB dump");
  console.log("   Run: ./packages/api/db.sh dump\n");
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

  // Analyse préliminaire
  const analysisResult = await analyze();

  console.log("=".repeat(60));
  console.log("Press Ctrl+C to cancel, or wait 3 seconds to continue...");
  console.log("=".repeat(60));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("\n");

  // Étape 1: Créer les entrées manquantes
  console.log("📋 Step 1: Creating missing entries...\n");

  let created = 0;
  for (const entry of analysisResult.missingEntries) {
    // Récupérer le label traduit
    const label = getCategoryLabel(
      entry.categoryId,
      entry.lang as SupportedLanguagesCode
    );

    await SearchSuggestionModel.create({
      sourceId: entry.sourceId,
      lang: entry.lang,
      label,
      categoryId: entry.categoryId,
      slug: entry.categoryId,
      synonyms: [],
      type: AutoCompleteType.CATEGORY,
      country: entry.country,
      content: "",
      seoTitle: "",
      seoDescription: "",
    });

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

  // Recharger pour inclure les nouvelles entrées
  const toTranslateRefreshed = await SearchSuggestionModel.find({
    type: AutoCompleteType.CATEGORY,
    $or: [
      { seoTitle: "" },
      { seoTitle: { $exists: false } },
      { seoDescription: "" },
      { seoDescription: { $exists: false } },
    ],
  });

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
        const result = await translateCategory(entry, anthropic);

        await SearchSuggestionModel.updateOne(
          { _id: entry._id },
          {
            $set: {
              seoTitle: result.seoTitle,
              seoDescription: result.seoDescription,
              synonyms: result.synonyms,
            },
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

  // Récupérer les catégories obsolètes
  const obsoleteEntries = analysisResult.extraEntries || [];
  let deleted = 0;

  if (obsoleteEntries.length > 0) {
    console.log(`Found ${obsoleteEntries.length} obsolete entries to remove\n`);

    // Grouper par catégorie pour l'affichage
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

    // Supprimer les entrées obsolètes
    const obsoleteIds = obsoleteEntries.map((e) => e._id);
    const deleteResult = await SearchSuggestionModel.deleteMany({
      _id: { $in: obsoleteIds },
    });

    deleted = deleteResult.deletedCount || 0;
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
  console.log("\n💡 Next step: Create MongoDB dump");
  console.log("   Run: ./packages/api/db.sh dump\n");
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
      await connectToDatabase();
      await sync();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program
  .command("clean")
  .description("Clean all translations (seoTitle, seoDescription, synonyms)")
  .action(async () => {
    try {
      await connectToDatabase();
      await clean();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program
  .command("analyze")
  .description("Analyze database without making changes")
  .action(async () => {
    try {
      await connectToDatabase();
      await analyze();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program
  .command("cleanup")
  .description("Remove obsolete categories from database and regenerate files")
  .action(async () => {
    try {
      await connectToDatabase();
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

  # Clean all translations (then run sync to regenerate)
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts clean

  # Clean + Sync
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts clean
  $ yarn workspace @soliguide/api tsx src/search/scripts/sync-categories.ts sync
`
);

program.parse(process.argv);
