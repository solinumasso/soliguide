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

const message = "Add lastLogin field to users and organizations collections";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // Add lastLogin field to users collection
  const usersCollection = db.collection("users");
  const usersCountBefore = await usersCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Found ${usersCountBefore} users without lastLogin field`
  );

  const usersResult = await usersCollection.updateMany(
    { lastLogin: { $exists: false } },
    { $set: { lastLogin: null } }
  );
  logger.info(
    `[MIGRATION] - Added lastLogin field to ${usersResult.modifiedCount} users`
  );

  // Add lastLogin field to organization collection
  const organizationCollection = db.collection("organization");
  const orgsCountBefore = await organizationCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Found ${orgsCountBefore} organizations without lastLogin field`
  );

  const orgsResult = await organizationCollection.updateMany(
    { lastLogin: { $exists: false } },
    { $set: { lastLogin: null } }
  );
  logger.info(
    `[MIGRATION] - Added lastLogin field to ${orgsResult.modifiedCount} organizations`
  );

  // Verify the migration
  const usersCountAfter = await usersCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  const orgsCountAfter = await organizationCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Remaining users without lastLogin: ${usersCountAfter}`
  );
  logger.info(
    `[MIGRATION] - Remaining organizations without lastLogin: ${orgsCountAfter}`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Remove lastLogin field from users collection
  const usersCollection = db.collection("users");
  const usersResult = await usersCollection.updateMany(
    {},
    { $unset: { lastLogin: "" } }
  );
  logger.info(
    `[ROLLBACK] - Removed lastLogin field from ${usersResult.modifiedCount} users`
  );

  // Remove lastLogin field from organization collection
  const organizationCollection = db.collection("organization");
  const orgsResult = await organizationCollection.updateMany(
    {},
    { $unset: { lastLogin: "" } }
  );
  logger.info(
    `[ROLLBACK] - Removed lastLogin field from ${orgsResult.modifiedCount} organizations`
  );
};
