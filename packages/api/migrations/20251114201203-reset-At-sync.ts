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
  "Reinitialize AT sync: set lastSync to null for excluded entities in lieux and users collections";

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const filterExcluded = {
    "atSync.excluded": false,
  };

  const filterLastSyncNotNull = {
    "atSync.lastSync": { $ne: null },
  };

  const update = {
    $set: { "atSync.lastSync": null },
  };

  // Étape 1 : Collection lieux
  const lieuxToUpdate = await db
    .collection("lieux")
    .countDocuments({ ...filterLastSyncNotNull, ...filterExcluded });
  logger.info(`[LIEUX] ${lieuxToUpdate} lieux to update`);

  const lieuxResult = await db
    .collection("lieux")
    .updateMany(filterExcluded, update);
  logger.info(`[LIEUX] Number of lieux modified: ${lieuxResult.modifiedCount}`);

  // Étape 2 : Collection users
  const usersToUpdate = await db
    .collection("users")
    .countDocuments({ ...filterExcluded, ...filterLastSyncNotNull });
  logger.info(`[USERS] ${usersToUpdate} users to update`);

  const usersResult = await db
    .collection("users")
    .updateMany(filterExcluded, update);
  logger.info(`[USERS] Number of users modified: ${usersResult.modifiedCount}`);

  logger.info("=== Migration completed ===");
};
