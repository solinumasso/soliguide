/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
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
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
  SearchSuggestion,
} from "@soliguide/common";

import { logger } from "../src/general/logger";

const message =
  "Reimport all search suggestions from frontend JSON files and clean collection";

interface JsonSuggestion {
  categoryId: string;
  label: string;
  slug: string;
  synonyms: string[];
  type: string;
  lang: string;
  country: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("search_suggestions");

  // Count documents before cleanup
  const countBefore = await collection.countDocuments();
  logger.info(
    `[MIGRATION] - Found ${countBefore} existing search suggestions`
  );

  // Clean the collection
  logger.info(`[MIGRATION] - Cleaning search_suggestions collection...`);
  await collection.deleteMany({});
  logger.info(`[MIGRATION] - Collection cleaned`);

  // Prepare to collect all suggestions
  const allSuggestions: Omit<SearchSuggestion, "_id" | "createdAt" | "updatedAt">[] = [];

  // Get all countries from SUPPORTED_LANGUAGES_BY_COUNTRY
  const countries = Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[];

  logger.info(
    `[MIGRATION] - Processing ${countries.length} countries: ${countries.join(", ")}`
  );

  // Iterate through each country
  for (const country of countries) {
    const countryConfig = SUPPORTED_LANGUAGES_BY_COUNTRY[country];
    const supportedLanguages: SupportedLanguagesCode[] = [
      countryConfig.source,
      ...countryConfig.otherLanguages,
    ];

    logger.info(
      `[MIGRATION] - Country ${country}: processing ${supportedLanguages.length} languages`
    );

    // Iterate through each language for this country
    for (const lang of supportedLanguages) {
      const filePath = join(
        __dirname,
        "../../frontend/src/assets/files",
        country,
        `${lang}.json`
      );

      if (!existsSync(filePath)) {
        logger.warn(
          `[MIGRATION] - File not found: ${filePath}, skipping ${country}/${lang}`
        );
        continue;
      }

      try {
        const fileContent = readFileSync(filePath, "utf-8");
        const jsonData: JsonSuggestion[] = JSON.parse(fileContent);

        logger.info(
          `[MIGRATION] - Processing ${jsonData.length} suggestions from ${country}/${lang}`
        );

        // Transform and add to collection
        for (const item of jsonData) {
          const suggestion: Omit<SearchSuggestion, "_id" | "createdAt" | "updatedAt"> = {
            sourceId: item.categoryId || `${item.type}_${item.slug}`,
            lang: item.lang as SupportedLanguagesCode,
            label: item.label,
            categoryId: item.categoryId || null,
            slug: item.slug || "",
            synonyms: item.synonyms || [],
            type: item.type,
            country: item.country as SoliguideCountries,
            content: item.content || "",
            seoTitle: item.seoTitle || "",
            seoDescription: item.seoDescription || "",
          };

          allSuggestions.push(suggestion);
        }
      } catch (error) {
        logger.error(
          `[MIGRATION] - Error processing file ${filePath}:`,
          error
        );
        throw error;
      }
    }
  }

  // Insert all suggestions
  if (allSuggestions.length > 0) {
    logger.info(
      `[MIGRATION] - Inserting ${allSuggestions.length} search suggestions...`
    );
    await collection.insertMany(allSuggestions);
    logger.info(`[MIGRATION] - Successfully inserted all suggestions`);
  } else {
    logger.warn(`[MIGRATION] - No suggestions to insert`);
  }

  // Verify the migration
  const countAfter = await collection.countDocuments();
  logger.info(
    `[MIGRATION] - Migration completed. Total suggestions in collection: ${countAfter}`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const collection = db.collection("search_suggestions");

  // Count documents before rollback
  const countBefore = await collection.countDocuments();
  logger.info(
    `[ROLLBACK] - Found ${countBefore} search suggestions to remove`
  );

  // Remove all suggestions (we cannot restore the old data)
  await collection.deleteMany({});

  logger.info(`[ROLLBACK] - All search suggestions removed`);
};
