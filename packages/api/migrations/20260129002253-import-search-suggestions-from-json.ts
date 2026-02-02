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
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const message = "Import search suggestions from JSON files";

interface JsonSuggestion {
  categoryId: string | null;
  label: string;
  slug: string;
  synonyms: string[];
  type: string;
  lang: string;
  country: string;
  seoTitle: string;
  seoDescription: string;
}

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const jsonBaseDir = join(__dirname, "../../frontend/src/assets/files");
  logger.info(`📁 Reading JSON files from: ${jsonBaseDir}`);

  let totalProcessed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  try {
    // Lire tous les pays (dossiers)
    const countries = await readdir(jsonBaseDir);

    for (const country of countries) {
      const countryPath = join(jsonBaseDir, country);

      // Vérifier que c'est un dossier
      const stat = await readdir(countryPath).catch(() => null);
      if (!stat) continue;

      logger.info(`\n🌍 Processing country: ${country.toUpperCase()}`);

      // Lire tous les fichiers JSON dans ce pays
      const files = await readdir(countryPath);
      const jsonFiles = files.filter((f) => f.endsWith(".json"));

      for (const file of jsonFiles) {
        const lang = file.replace(".json", "");
        const filePath = join(countryPath, file);

        try {
          logger.info(`  📝 Processing: ${country}/${lang}`);

          // Lire et parser le JSON
          const content = await readFile(filePath, "utf-8");
          const suggestions: JsonSuggestion[] = JSON.parse(content);

          logger.info(`     Found ${suggestions.length} suggestions`);

          // Importer chaque suggestion
          for (const suggestion of suggestions) {
            try {
              // Générer le sourceId
              const sourceId = suggestion.categoryId
                ? `${suggestion.categoryId}_${country}_${lang}`
                : `${suggestion.label
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, "")}_${country}_${lang}`;

              // Préparer le document
              const doc = {
                sourceId,
                lang,
                label: suggestion.label,
                categoryId: suggestion.categoryId || null,
                slug: suggestion.slug || "",
                synonyms: suggestion.synonyms || [],
                type: suggestion.type,
                country: country.toUpperCase(),
                content: "",
                seoTitle: suggestion.seoTitle || "",
                seoDescription: suggestion.seoDescription || "",
                updatedAt: new Date(),
              };

              // Upsert: update si existe, insert sinon
              const result = await db
                .collection("search_suggestions")
                .updateOne(
                  { sourceId, lang },
                  {
                    $set: doc,
                    $setOnInsert: { createdAt: new Date() },
                  },
                  { upsert: true }
                );

              if (result.upsertedCount > 0) {
                totalInserted++;
              } else if (result.modifiedCount > 0) {
                totalUpdated++;
              }

              totalProcessed++;
            } catch (error: any) {
              totalErrors++;
              logger.error(
                `     ❌ Error processing suggestion ${suggestion.label}:`,
                error.message
              );
            }
          }

          logger.info(
            `     ✅ Completed ${country}/${lang} (${suggestions.length} items)`
          );
        } catch (error: any) {
          totalErrors++;
          logger.error(`  ❌ Error reading ${filePath}:`, error.message);
        }
      }
    }

    // Résumé final
    logger.info("\n" + "=".repeat(60));
    logger.info("📊 Import Summary:");
    logger.info(`  📝 Total processed: ${totalProcessed}`);
    logger.info(`  ✨ New insertions: ${totalInserted}`);
    logger.info(`  🔄 Updated: ${totalUpdated}`);
    logger.info(`  ❌ Errors: ${totalErrors}`);
    logger.info("=".repeat(60));

    logger.info("\n✅ Migration completed successfully");
  } catch (error: any) {
    logger.error("❌ Fatal error during migration:", error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Note: On ne supprime pas les données en rollback car elles peuvent être précieuses
  // Si vraiment nécessaire, il faudrait sauvegarder l'état avant migration
  logger.warn("⚠️  Rollback not implemented - data preserved for safety");
  logger.warn("   If you need to rollback, restore from a database backup");
};
