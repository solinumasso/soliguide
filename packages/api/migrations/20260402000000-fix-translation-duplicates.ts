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
import { AnyBulkWriteOperation, Db, Document } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Fix translation duplicates: propagate best translations to NEED_AUTO_TRANSLATE records sharing the same content";

const BATCH_SIZE = 500;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  // Index makes each per-content updateMany an index scan instead of a full collection scan
  await collection.createIndex({ content: 1, status: 1 });

  // One aggregation pass over already-translated records to find the best translation per content.
  // Sorting descending: TRANSLATION_COMPLETE (T…) takes priority over NEED_HUMAN_TRANSLATE (N…H…)
  const cursor = collection.aggregate<{
    _id: string;
    languages: Document;
    status: string;
  }>(
    [
      {
        $match: {
          status: { $in: ["NEED_HUMAN_TRANSLATE", "TRANSLATION_COMPLETE"] },
        },
      },
      { $sort: { status: -1 } },
      {
        $group: {
          _id: "$content",
          languages: { $first: "$languages" },
          status: { $first: "$status" },
        },
      },
    ],
    { allowDiskUse: true }
  );

  let updatedCount = 0;
  let batch: AnyBulkWriteOperation[] = [];

  for await (const { _id: content, languages, status } of cursor) {
    batch.push({
      updateMany: {
        filter: { content, status: "NEED_AUTO_TRANSLATE" },
        update: { $set: { languages, status } },
      },
    });

    if (batch.length >= BATCH_SIZE) {
      const result = await collection.bulkWrite(batch, { ordered: false });
      updatedCount += result.modifiedCount;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await collection.bulkWrite(batch, { ordered: false });
    updatedCount += result.modifiedCount;
  }

  logger.info(`[MIGRATION] Updated ${updatedCount} translatedField documents`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, translations cannot be un-propagated`
  );
};
