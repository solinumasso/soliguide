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
import { PairingSources } from "@soliguide/common";

const message = "Reset AT synvhro for Restos";

export const up = async (db: Db) => {
  logger.warn(`[MIGRATION] - ${message}`);

  const placesUpdated = await db.collection("lieux").updateMany(
    {
      "sources.name": PairingSources.RESTOS,
      "atSync.excluded": false,
    },
    {
      $set: {
        "atSync.lastSync": null,
      },
    }
  );

  logger.info(
    `[MIGRATION] - ${placesUpdated.modifiedCount} places from Restos reseted`
  );
};

export const down = () => {
  logger.info(`[ROLLBACK] - IMPOSSIBLE`);
};
