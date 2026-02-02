/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2026 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Db } from "mongodb";
import { logger } from "../src/general/logger";
import {
  Categories,
  AutoCompleteType,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { CategoryTranslationScript } from "../src/search/scripts/generate-categories-autocomplete";
import { SearchSuggestionModel } from "../src/search/models/search-suggestion.model";

const message = "Add new transport categories to search_suggestions";

// Mapping des nouvelles catégories avec leurs pays
const newCategories = [
  {
    category: Categories.TRANSPORTATION_MOBILITY,
    slug: "transportation_mobility",
    countries: ["FR", "ES", "AD"],
  },
  {
    category: Categories.PERSONAL_VEHICLE_ACCESS,
    slug: "personal_vehicle_access",
    countries: ["FR"],
  },
  {
    category: Categories.VEHICLE_MAINTENANCE,
    slug: "vehicle_maintenance",
    countries: ["FR"],
  },
  {
    category: Categories.MOBILITY_SUPPORT,
    slug: "mobility_support",
    countries: ["FR", "ES", "AD"],
  },
  {
    category: Categories.DRIVING_LICENSE,
    slug: "driving_license",
    countries: ["FR"],
  },
  {
    category: Categories.MOBILITY_FINANCING,
    slug: "mobility_financing",
    countries: ["FR", "ES", "AD"],
  },
];

// Anciennes catégories à supprimer
const oldCategoriesToRemove = [
  "carpooling",
  "provision_of_vehicles",
  "chauffeur_driven_transport",
  "mobility_assistance",
];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // 1. Supprimer les anciennes catégories
  logger.info(
    "🗑️  Removing old mobility categories from search_suggestions..."
  );

  const deleteResult = await db.collection("search_suggestions").deleteMany({
    categoryId: { $in: oldCategoriesToRemove },
  });

  logger.info(
    `✅ Deleted ${deleteResult.deletedCount} old category suggestions`
  );

  // ✅ AJOUTER CETTE ÉTAPE : Supprimer les anciennes versions des NOUVELLES catégories
  logger.info("🗑️  Removing old versions of new transport categories...");

  const newCategoryIds = newCategories.map((c) => c.category);
  const deleteOldVersions = await db
    .collection("search_suggestions")
    .deleteMany({
      categoryId: { $in: newCategoryIds },
    });

  logger.info(
    `✅ Deleted ${deleteOldVersions.deletedCount} old versions of new categories`
  );

  // 2. Ajouter les nouvelles catégories de base (sans traductions)
  logger.info("✨ Adding new transport categories to search_suggestions...");

  const suggestions = [];

  for (const { category, slug, countries } of newCategories) {
    for (const country of countries) {
      // On crée une suggestion par pays, mais seulement pour la langue source
      // Les autres langues seront générées par le script translateCategory

      // Déterminer la langue source selon le pays
      let sourceLang = SupportedLanguagesCode.FR; // Par défaut FR
      if (country === "ES" || country === "AD") {
        // Pour ES et AD, on peut choisir la langue source
        // On va créer en FR d'abord, puis le script traduira
        sourceLang = SupportedLanguagesCode.FR;
      }

      suggestions.push({
        sourceId: `${category}_${country}_${sourceLang}`,
        lang: sourceLang,
        label: category, // Le label sera celui de l'enum
        categoryId: category,
        slug: slug,
        synonyms: [],
        type: AutoCompleteType.CATEGORY,
        country: country,
        content: "",
        seoTitle: "", // Vide, sera rempli par translateCategory
        seoDescription: "", // Vide, sera rempli par translateCategory
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  if (suggestions.length > 0) {
    const insertResult = await db
      .collection("search_suggestions")
      .insertMany(suggestions);
    logger.info(
      `✅ Inserted ${insertResult.insertedCount} new category suggestions (base)`
    );
  }

  // 3. Générer les traductions avec translateCategory
  logger.info(
    "🤖 Starting automatic translation of new categories with translateCategory..."
  );

  try {
    const translationScript = new CategoryTranslationScript({
      country: "all",
      lang: "all",
      type: "categories",
      clean: false,
    });

    // Récupérer toutes les suggestions non traduites (seoTitle vide)
    const untranslatedSuggestions = await SearchSuggestionModel.find({
      $or: [{ seoTitle: "" }, { seoTitle: { $exists: false } }],
      type: AutoCompleteType.CATEGORY,
    });

    if (untranslatedSuggestions.length === 0) {
      logger.info("✅ No categories to translate");
    } else {
      logger.info(
        `📊 Found ${untranslatedSuggestions.length} categories to translate`
      );

      let successCount = 0;
      let errorCount = 0;

      for (const suggestion of untranslatedSuggestions) {
        try {
          logger.info(
            `🌍 Translating: ${suggestion.label} (${suggestion.country}/${suggestion.lang})`
          );

          const translation = await translationScript.translateCategory({
            _id: suggestion._id,
            sourceId: suggestion.sourceId,
            label: suggestion.label,
            seoTitle: suggestion.seoTitle || "",
            seoDescription: suggestion.seoDescription || "",
            synonyms: suggestion.synonyms || [],
            type: suggestion.type,
            lang: suggestion.lang,
            country: suggestion.country,
            categoryId: suggestion.categoryId,
          });

          // Enregistrer la traduction dans la DB
          await SearchSuggestionModel.updateOne(
            { _id: suggestion._id },
            {
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              synonyms: translation.synonyms,
            },
            { upsert: true }
          );

          successCount++;
          logger.info(`  ✅ Successfully translated`);

          // Délai pour éviter le rate limiting de l'API Claude
          await delay(1000);
        } catch (error: any) {
          errorCount++;
          logger.error(
            `  ❌ Error translating ${suggestion.label}:`,
            error.message
          );
        }
      }

      logger.info("\n" + "=".repeat(50));
      logger.info("📊 Translation Summary:");
      logger.info(`  ✅ Success: ${successCount}`);
      logger.info(`  ❌ Errors: ${errorCount}`);
      logger.info(`  📝 Total processed: ${untranslatedSuggestions.length}`);
      logger.info("=".repeat(50));
    }
  } catch (error) {
    logger.error("❌ Error during translation:", error);
    logger.info("⚠️  You can manually run translations with the command:");
    logger.info(
      "   tsx src/search/scripts/generate-categories-autocomplete.ts --country all --lang all --type categories"
    );
  }
};

/**
 * Helper function to add delay between API calls
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Supprimer les nouvelles catégories ajoutées
  const categoryIds = newCategories.map((c) => c.category);

  const deleteResult = await db.collection("search_suggestions").deleteMany({
    categoryId: { $in: categoryIds },
  });

  logger.info(`Removed ${deleteResult.deletedCount} new category suggestions`);

  // Note: On ne recrée pas les anciennes catégories en rollback
  // car elles sont obsolètes
  logger.info("⚠️  Old categories NOT restored (they are obsolete)");
};
