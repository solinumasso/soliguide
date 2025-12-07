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
import { Categories } from "@soliguide/common";

const message = "Migrate old mobility categories to new ones";

const categoryMapping: Record<string, Categories> = {
  carpooling: Categories.TRANSPORTATION_MOBILITY,
  provision_of_vehicles: Categories.PERSONAL_VEHICLE_ACCESS,
  chauffeur_driven_transport: Categories.TRANSPORTATION_MOBILITY,
  mobility_assistance: Categories.MOBILITY_FINANCING,
};
export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    const result = await db.collection("lieux").updateMany(
      { "services_all.category": oldCategory },
      {
        $set: { "services_all.$[elem].category": newCategory },
      },
      {
        arrayFilters: [{ "elem.category": oldCategory }],
      }
    );
    logger.info(
      `Updated ${result.modifiedCount} documents: replaced category '${oldCategory}' with '${newCategory}'`
    );
  }
};

export const down = () => {
  logger.info("[ROLLBACK] - No rollback possible");
};
