/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { translator } from "../src/config";
import {
  AutoCompleteType,
  SearchSuggestion,
  getSeoSlug,
  CountryCodes,
  CATEGORIES,
  CATEGORIES_SOLIGUIA_AD,
  CATEGORIES_SOLIGUIA_ES,
  CATEGORIES_SOLIGUIDE_FR,
  SoliguideCountries,
} from "@soliguide/common";
import {
  AUTOCOMPLETE_ESTABLISHMENT_TYPES,
  AUTOCOMPLETE_ORGANIZATIONS,
} from "../src/search/constants/AUTOCOMPLETE.const";

import { TMP_AUTOCOMPLETE } from "./templates/TMP_AUTOCOMPLETE.const";
import { getLangsForCountry } from "../src/search/utils";

const message = "Generate suggestions";

export const generateSourceId = (
  type: AutoCompleteType,
  label: string
): string => {
  const getPrefix = (type: AutoCompleteType): string => {
    switch (type) {
      case AutoCompleteType.ORGANIZATION:
        return "ORG_";
      case AutoCompleteType.ESTABLISHMENT_TYPE:
        return "EST_";
      case AutoCompleteType.CATEGORY:
        return "CAT_";
      case AutoCompleteType.EXPRESSION:
        return "EXP_";
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  return `${getPrefix(type)}${getSeoSlug(label)
    .replaceAll("-", "_")
    .replaceAll(" ", "_")
    .toUpperCase()}`;
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  console.log(
    "🚀 Starting migration of search suggestions (per-country languages)"
  );

  const existingDocs = TMP_AUTOCOMPLETE;

  console.log(`📊 Found ${existingDocs.length} existing category docs`);

  const newCollectionName = "search_suggestions";

  try {
    await db.createCollection(newCollectionName);
    await db.collection(newCollectionName).deleteMany({});
    await db.collection(newCollectionName).dropIndexes();
  } catch (e) {
    console.log(e);
  }

  // Create sets for easier lookup
  const FR_SPECIFIC_IDS = new Set(CATEGORIES_SOLIGUIDE_FR.map((c) => c.id));
  const ES_SPECIFIC_IDS = new Set(CATEGORIES_SOLIGUIA_ES.map((c) => c.id));
  const AD_SPECIFIC_IDS = new Set(CATEGORIES_SOLIGUIA_AD.map((c) => c.id));
  const ALL_BASE_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

  // Get all category IDs that need to be processed
  const allCategoryIds = new Set([
    ...ALL_BASE_CATEGORY_IDS,
    ...FR_SPECIFIC_IDS,
    ...ES_SPECIFIC_IDS,
    ...AD_SPECIFIC_IDS,
  ]);

  console.log(`📋 Total unique categories to process: ${allCategoryIds.size}`);

  // Process each category
  for (const categoryId of allCategoryIds) {
    // Find the doc in TMP_AUTOCOMPLETE if it exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = existingDocs.find((d: any) => d.categoryId === categoryId);

    if (!doc) {
      console.log(`⚠️  No template found for category ${categoryId}, skipping`);
      continue;
    }

    const sourceId = generateSourceId(doc.type, doc.label);

    // Determine which countries should have this category
    const targetCountries: SoliguideCountries[] = [];

    const isInBase = ALL_BASE_CATEGORY_IDS.has(categoryId);
    const isInFR = FR_SPECIFIC_IDS.has(categoryId);
    const isInES = ES_SPECIFIC_IDS.has(categoryId);
    const isInAD = AD_SPECIFIC_IDS.has(categoryId);

    if (isInBase) {
      // Common category available in all countries
      targetCountries.push(CountryCodes.FR, CountryCodes.ES, CountryCodes.AD);
    } else {
      // Country-specific category
      if (isInFR) targetCountries.push(CountryCodes.FR);
      if (isInES) targetCountries.push(CountryCodes.ES);
      if (isInAD) targetCountries.push(CountryCodes.AD);
    }

    if (targetCountries.length === 0) {
      console.log(`⚠️  No target countries for category ${categoryId}`);
      continue;
    }

    const countryDocs: SearchSuggestion[] = [];
    for (const country of targetCountries) {
      const langs = getLangsForCountry(country);

      for (const lang of langs) {
        const label = translator.t(doc.label, { lng: lang });
        const synonyms = doc.synonyms
          ? doc.synonyms
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

        countryDocs.push({
          sourceId,
          lang,
          country,
          label,
          slug: doc.seo || getSeoSlug(label),
          synonyms,
          type: doc.type,
          content: "",
          categoryId: doc.categoryId,
          seoTitle: "",
          seoDescription: doc.description || "",
          createdAt: doc.createdAt || new Date(),
          updatedAt: doc.updatedAt || new Date(),
        });
      }
    }

    if (countryDocs.length) {
      await db.collection(newCollectionName).insertMany(countryDocs);
      console.log(
        `✅ Inserted ${
          countryDocs.length
        } docs for ${categoryId} (${targetCountries.join(", ")})`
      );
    }
  }

  // Organizations
  console.log("📝 Adding organizations...");
  for (const country of Object.keys(AUTOCOMPLETE_ORGANIZATIONS) as Array<
    keyof typeof AUTOCOMPLETE_ORGANIZATIONS
  >) {
    const langs = getLangsForCountry(country);
    const countryDocs: SearchSuggestion[] = [];

    for (const org of AUTOCOMPLETE_ORGANIZATIONS[country]) {
      const sourceId = generateSourceId(
        AutoCompleteType.ORGANIZATION,
        org.slug
      );

      for (const lang of langs) {
        countryDocs.push({
          sourceId,
          lang,
          label: org.label,
          country,
          slug: getSeoSlug(org.slug),
          categoryId: null,
          synonyms: org.synonyms,
          type: AutoCompleteType.ORGANIZATION,
          content: "",
          seoTitle: "",
          seoDescription: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    if (countryDocs.length) {
      await db.collection(newCollectionName).insertMany(countryDocs);
      console.log(
        `✅ Inserted ${countryDocs.length} organizations for ${country}`
      );
    }
  }

  // Establishment types
  console.log("📝 Adding establishment types...");
  for (const country of Object.keys(AUTOCOMPLETE_ESTABLISHMENT_TYPES) as Array<
    keyof typeof AUTOCOMPLETE_ESTABLISHMENT_TYPES
  >) {
    const langs = getLangsForCountry(country);
    const countryDocs: SearchSuggestion[] = [];

    for (const estType of AUTOCOMPLETE_ESTABLISHMENT_TYPES[country]) {
      const sourceId = generateSourceId(
        AutoCompleteType.ESTABLISHMENT_TYPE,
        estType.slug
      );

      for (const lang of langs) {
        countryDocs.push({
          sourceId,
          lang,
          label: estType.label,
          country,
          slug: getSeoSlug(estType.slug),
          categoryId: null,
          synonyms: estType.synonyms,
          type: AutoCompleteType.ESTABLISHMENT_TYPE,
          content: "",
          seoTitle: "",
          seoDescription: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    if (countryDocs.length) {
      await db.collection(newCollectionName).insertMany(countryDocs);
      console.log(
        `✅ Inserted ${countryDocs.length} establishment types for ${country}`
      );
    }
  }

  console.log("🎉 Migration complete");
};
