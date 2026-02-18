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

const message = "Remove campaigns field from users";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const result = await db
    .collection("users")
    .updateMany(
      { campaigns: { $exists: true } },
      { $unset: { campaigns: "" } }
    );

  logger.info(
    `[MIGRATION] - Removed campaigns from ${result.modifiedCount} users`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  // Cannot restore campaigns data - this is a one-way migration
  await db.collection("users").findOne();
};
