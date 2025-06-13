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
import { PRIORITARY_CATEGORIES } from "../src/categories/constants/prioritary-categories.const";
import { PlaceStatus } from "@soliguide/common";

const message = "Fix priorty of places in the database";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  await db.collection("lieux").updateMany({}, { $set: { priority: false } });

  await db.collection("lieux").updateMany(
    {
      "services_all.category": { $in: PRIORITARY_CATEGORIES },
      status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
    },
    { $set: { priority: true } }
  );
};

export const down = () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info("NO ROLLBACK POSSIBLE");
};
