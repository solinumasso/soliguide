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
import { SupportedLanguagesCode } from "@soliguide/common";

const message = "Generate campaign mails templates";

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  console.log("🚀 Migration of search suggestions to a new collection");

  const existingDocs = await db.collection("autoComplete").find({}).toArray();
  console.log(`📊 ${existingDocs.length} existing docs`);

  const newCollectionName = "search_suggestions";
  await db.createCollection(newCollectionName);
  await db.collection(newCollectionName).deleteMany({});

  const newDocs = [];

  for (const doc of existingDocs) {
    const referenceId = doc.seo || doc._id.toString();

    const frenchDoc = {
      id: `${referenceId}_fr`,
      referenceId: referenceId,
      lang: "fr",
      categoryId: doc.categoryId,
      description: doc.description || "",
      expressionId: doc.expressionId,
      label: translator.t(doc.label, { lng: SupportedLanguagesCode.FR }),
      slug: doc.seo || "",
      synonyms: doc.synonyms
        ? doc.synonyms
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      type: doc.type,
      seoTitle: "",
      seoDescription: "",
      searchText: "",
      normalizedSearchText: "",
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };

    newDocs.push(frenchDoc);
  }

  if (newDocs.length > 0) {
    await db.collection(newCollectionName).insertMany(newDocs);
    console.log(`✅ ${newDocs.length} suggestions created`);
  }

  await db
    .collection(newCollectionName)
    .createIndex({ id: 1 }, { unique: true });
  await db
    .collection(newCollectionName)
    .createIndex({ referenceId: 1, lang: 1 }, { unique: true });
  await db.collection(newCollectionName).createIndex({ lang: 1, type: 1 });
  await db.collection(newCollectionName).createIndex({ slug: 1 });
  await db.collection(newCollectionName).createIndex({ categoryId: 1 });
  await db.collection(newCollectionName).createIndex({ expressionId: 1 });
  await db.collection(newCollectionName).createIndex({ searchText: "text" });

  console.log("✅ Migration complete");
};
