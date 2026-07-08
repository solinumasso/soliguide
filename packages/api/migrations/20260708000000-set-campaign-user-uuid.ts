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
import { AnyBulkWriteOperation, Db } from "mongodb";
import { v5 as uuidv5 } from "uuid";

import { CAMPAIGN_USER_UUID_NAMESPACE } from "@soliguide/common";

import { logger } from "../src/general/logger";

const message = "Backfill campaignUserUuid on users (v5 derived from _id)";
const usersCollection = "users";
const BATCH_SIZE = 500;

// Rupture volontaire du pattern habituel (`updateMany` + pipeline) :
// UUID v5 = SHA-1(namespace + name), non-calculable dans `$expr` MongoDB.
// D'où : curseur + `bulkWrite` par batch, avec dérivation JS déterministe.
// Idempotent via le filtre `campaignUserUuid: { $exists: false }` :
// re-run = no-op sur les users déjà migrés.
export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const filter = { campaignUserUuid: { $exists: false } };
  const collection = db.collection(usersCollection);

  const total = await collection.countDocuments(filter);
  logger.info(`[MIGRATION] - ${total} users to backfill`);

  if (total === 0) {
    logger.info("[MIGRATION] - nothing to do, exiting");
    return;
  }

  const cursor = collection.find(filter, {
    projection: { _id: 1 },
    batchSize: BATCH_SIZE,
  });

  let operations: AnyBulkWriteOperation[] = [];
  let processed = 0;

  for await (const doc of cursor) {
    operations.push({
      updateOne: {
        filter: { _id: doc._id, campaignUserUuid: { $exists: false } },
        update: {
          $set: {
            campaignUserUuid: uuidv5(
              doc._id.toString(),
              CAMPAIGN_USER_UUID_NAMESPACE
            ),
          },
        },
      },
    });

    if (operations.length >= BATCH_SIZE) {
      const result = await collection.bulkWrite(operations, { ordered: false });
      processed += result.modifiedCount;
      logger.info(`[MIGRATION] - ${processed}/${total} users updated`);
      operations = [];
    }
  }

  if (operations.length > 0) {
    const result = await collection.bulkWrite(operations, { ordered: false });
    processed += result.modifiedCount;
  }

  logger.info(`[MIGRATION] - done: ${processed}/${total} users updated`);
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const result = await db
    .collection(usersCollection)
    .updateMany(
      { campaignUserUuid: { $exists: true } },
      { $unset: { campaignUserUuid: "" } }
    );

  logger.info(
    `[ROLLBACK] - done: ${result.matchedCount} matched, ${result.modifiedCount} unset`
  );
};
