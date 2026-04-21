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
import { AnyBulkWriteOperation, Db, ObjectId } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Deduplicate translatedFields on (lieu_id, elementName, serviceObjectId) and enforce unique index";

const UNIQUE_INDEX_NAME = "unique_translated_field_per_element";
const BATCH_SIZE = 500;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  // Sort so that the most advanced status (TRANSLATION_COMPLETE > NEED_HUMAN_TRANSLATE >
  // NEED_AUTO_TRANSLATE) and most recently updated document is kept ($first after sort).
  const cursor = collection.aggregate<{
    keepId: ObjectId;
    toDelete: ObjectId[];
    count: number;
  }>(
    [
      { $sort: { status: -1, updatedAt: -1 } },
      {
        $group: {
          _id: {
            lieu_id: "$lieu_id",
            elementName: "$elementName",
            serviceObjectId: "$serviceObjectId",
          },
          count: { $sum: 1 },
          keepId: { $first: "$_id" },
          allIds: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
      {
        $project: {
          keepId: 1,
          count: 1,
          toDelete: {
            $filter: {
              input: "$allIds",
              as: "id",
              cond: { $ne: ["$$id", "$keepId"] },
            },
          },
        },
      },
    ],
    { allowDiskUse: true }
  );

  let deletedCount = 0;
  let dupGroupCount = 0;
  let batch: AnyBulkWriteOperation[] = [];

  for await (const { toDelete } of cursor) {
    dupGroupCount++;
    batch.push({ deleteMany: { filter: { _id: { $in: toDelete } } } });

    if (batch.length >= BATCH_SIZE) {
      const result = await collection.bulkWrite(batch, { ordered: false });
      deletedCount += result.deletedCount;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await collection.bulkWrite(batch, { ordered: false });
    deletedCount += result.deletedCount;
  }

  logger.info(
    `[MIGRATION] Removed ${deletedCount} duplicate documents across ${dupGroupCount} groups`
  );

  // Create unique index now that duplicates are gone
  await collection.createIndex(
    { lieu_id: 1, elementName: 1, serviceObjectId: 1 },
    { unique: true, name: UNIQUE_INDEX_NAME }
  );

  logger.info(`[MIGRATION] Unique index "${UNIQUE_INDEX_NAME}" created`);
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  await db.collection("translatedFields").dropIndex(UNIQUE_INDEX_NAME);

  logger.info(
    `[ROLLBACK] Unique index "${UNIQUE_INDEX_NAME}" dropped — deleted duplicates cannot be restored`
  );
};
