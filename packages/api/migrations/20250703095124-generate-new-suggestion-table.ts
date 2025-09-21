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

import { logger } from "../src/general/logger";
import { translator } from "../src/config";
import {
  AutoCompleteType,
  SearchSuggestion,
  getSeoSlug,
  SupportedLanguagesCode,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";
import {
  AUTOCOMPLETE_ORGANIZATIONS,
  AUTOCOMPLETE_ESTABLISHMENT_TYPES,
} from "../src/search/constants/AUTOCOMPLETE.const";

const message = "Generate campaign mails templates";

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  console.log(
    "🚀 Migration of search suggestions to a new collection (multilingual)"
  );

  // Récupérer les documents existants (catégories uniquement)
  const existingDocs = await db
    .collection("autoComplete")
    .find({
      type: "CATEGORY",
    })
    .toArray();
  console.log(`📊 ${existingDocs.length} existing category docs`);

  const newCollectionName = "search_suggestions";
  await db.createCollection(newCollectionName);
  await db.collection(newCollectionName).deleteMany({});
  await db.collection(newCollectionName).dropIndexes();

  const newDocs = [];

  // Obtenir toutes les langues supportées

  console.log(`🌍 Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}`);

  // Migrer les catégories existantes pour toutes les langues
  for (const doc of existingDocs) {
    const sourceId = generateSourceId(doc.type, doc.label);

    for (const lang of SUPPORTED_LANGUAGES) {
      const label = translator.t(doc.label, { lng: lang });
      const synonyms = doc.synonyms
        ? doc.synonyms
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      const languageDoc: SearchSuggestion = {
        sourceId: sourceId,
        lang: lang,
        label: label,
        slug: doc.seo || getSeoSlug(label),
        synonyms: synonyms,
        type: doc.type,
        content: "",
        categoryId: doc.categoryId,
        seoTitle: "",
        seoDescription: doc.description || "",
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
      };

      newDocs.push(languageDoc);
    }
  }

  // Ajouter les organisations (uniquement en français comme demandé)
  console.log("📝 Adding organizations (French only)...");
  for (const org of AUTOCOMPLETE_ORGANIZATIONS) {
    const sourceId = generateSourceId(AutoCompleteType.ORGANIZATION, org.slug);

    const orgDoc: SearchSuggestion = {
      sourceId: sourceId,
      lang: SupportedLanguagesCode.FR,
      label: org.label,
      slug: getSeoSlug(org.slug),
      categoryId: null,
      synonyms: org.synonyms,
      type: AutoCompleteType.ORGANIZATION,
      content: "",
      seoTitle: "",
      seoDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    newDocs.push(orgDoc);
  }

  // Ajouter les types d'établissements (uniquement en français comme demandé)
  console.log("📝 Adding establishment types (French only)...");
  for (const estType of AUTOCOMPLETE_ESTABLISHMENT_TYPES) {
    const sourceId = generateSourceId(
      AutoCompleteType.ESTABLISHMENT_TYPE,
      estType.slug
    );

    const estDoc: SearchSuggestion = {
      sourceId: sourceId,
      lang: SupportedLanguagesCode.FR,
      label: estType.label,
      slug: getSeoSlug(estType.slug),
      categoryId: null,
      synonyms: estType.synonyms,
      type: AutoCompleteType.ESTABLISHMENT_TYPE,
      content: "",
      seoTitle: "",
      seoDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    newDocs.push(estDoc);
  }

  // Insérer tous les documents
  if (newDocs.length > 0) {
    await db.collection(newCollectionName).insertMany(newDocs);
    console.log(`✅ ${newDocs.length} suggestions created:`);
    console.log(
      `   - ${
        existingDocs.length * SUPPORTED_LANGUAGES.length
      } category docs migrated (${existingDocs.length} categories × ${
        SUPPORTED_LANGUAGES.length
      } languages)`
    );
    console.log(
      `   - ${AUTOCOMPLETE_ORGANIZATIONS.length} organizations added (French only)`
    );
    console.log(
      `   - ${AUTOCOMPLETE_ESTABLISHMENT_TYPES.length} establishment types added (French only)`
    );
  }

  console.log("✅ Migration complete");
};

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
        throw new Error(`Type non supporté: ${type}`);
    }
  };

  return `${getPrefix(type)}${getSeoSlug(label)
    .replace(/-/g, "_")
    .replace(/ /g, "_")
    .toUpperCase()}`;
};
