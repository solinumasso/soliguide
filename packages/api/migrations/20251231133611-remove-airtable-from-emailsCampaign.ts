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

const message =
  "Remove airtable field (including lastSync) from emailsCampaign collection";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("emailsCampaign");

  // Count documents before migration
  const countBefore = await collection.countDocuments({
    airtable: { $exists: true },
  });
  logger.info(
    `[MIGRATION] - Found ${countBefore} documents with airtable field`
  );

  // Remove the airtable field from all documents
  const result = await collection.updateMany({}, { $unset: { airtable: "" } });

  logger.info(`[MIGRATION] - Updated ${result.modifiedCount} documents`);

  // Verify the migration
  const countAfter = await collection.countDocuments({
    airtable: { $exists: true },
  });
  logger.info(
    `[MIGRATION] - Remaining documents with airtable field: ${countAfter}`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const collection = db.collection("emailsCampaign");

  // Add back the airtable field with default values
  const result = await collection.updateMany(
    { airtable: { $exists: false } },
    {
      $set: {
        airtable: {
          lastSync: null,
          recordId: null,
          synced: false,
        },
      },
    }
  );

  logger.info(
    `[ROLLBACK] - Restored airtable field in ${result.modifiedCount} documents`
  );
};
