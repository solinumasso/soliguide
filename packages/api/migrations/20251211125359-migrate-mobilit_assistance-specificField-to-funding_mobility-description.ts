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
import { Categories, CommonNewPlaceService } from "@soliguide/common";

const message =
  "Migrate mobitlityAssistanceName specificField to funding_mobility.description";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const placesToUpdate = await db
    .collection("lieux")
    .find({
      services_all: {
        $elemMatch: {
          category: "mobility_financing",
        },
      },
    })
    .toArray();

  let migratedCount = 0;

  placesToUpdate.forEach((place) => {
    let modified = false;
    place.services_all = place.services_all.map(
      (service: CommonNewPlaceService) => {
        if (service.category === Categories.MOBILITY_FINANCING) {
          const specificField =
            service.categorySpecificFields?.mobilityAssistanceName;

          if (specificField) {
            if (service.description) {
              service.description += `<p>${specificField}</p>`;
            } else {
              service.description = `<p>${specificField}</p>`;
            }

            migratedCount++;
            modified = true;
          }
        }
        return service;
      }
    );

    if (modified) {
      db.collection("lieux").updateOne(
        { _id: place._id },
        { $set: { services_all: place.services_all } }
      );
    }
  });

  logger.info(
    `[MIGRATION] - ${migratedCount} mobilityAssistanceName field migrated`
  );
};

export const down = () => {
  logger.info("[ROLLBACK] - No rollback possible");
};
