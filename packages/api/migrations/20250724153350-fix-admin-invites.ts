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

const message = "Clean organizations for users with pending invitations";

export const up = async (db: Db) => {
  try {
    logger.info(`[MIGRATION] - Start - ${message}`);

    logger.info(`[MIGRATION] - Fetching pending invitations...`);
    const invitations = await db
      .collection("invitations")
      .find({
        pending: true,
        user: { $exists: true, $ne: null },
      })
      .project({ user: 1 })
      .toArray();

    logger.info(
      `[MIGRATION] - Found ${invitations.length} pending invitations`
    );

    if (invitations.length === 0) {
      logger.info(`[MIGRATION] - No valid users found, skipping update`);
      return;
    }

    const userIds = [...new Set(invitations.map((inv) => inv.user))];
    logger.info(`[MIGRATION] - Unique users to update: ${userIds.length}`);

    const result = await db.collection("users").updateMany(
      {
        _id: { $in: userIds },
        "organizations.0": { $exists: true },
      },
      { $set: { organizations: [] } }
    );

    logger.info(`[MIGRATION] - Users modified: ${result.modifiedCount}`);
    logger.info(`[MIGRATION] - Success - ${message}`);
  } catch (error) {
    logger.error(`[MIGRATION] - Failed - ${message}`, error);
    throw error;
  }
};

export const down = async () => {
  logger.info(`[ROLLBACK] - Rollback triggered - ${message}`);
  logger.info(`[ROLLBACK] - No rollback logic implemented`);
};
