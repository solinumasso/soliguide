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

import { updateServicesAfterPatch } from "../src/place/utils";
import { ApiPlace } from "@soliguide/common";

const message =
  "Fix Services fields when different Modalities/Hours/Publics are falsy";
const BATCH_SIZE = 500;

export const countPlacesNotMigrated = async (db: Db) => {
  return await db.collection("lieux").countDocuments({ migrated: false });
};

export const getPlacesNotMigrated = async (db: Db) => {
  return await db
    .collection("lieux")
    .find({ migrated: false })
    .project({
      _id: 1,
      placeType: 1,
      parcours: 1,
      position: 1,
      status: 1,
      tempInfos: 1,
      country: 1,
      publics: 1,
      modalities: 1,
      newhours: 1,
      services_all: 1,
    })
    .limit(BATCH_SIZE)
    .toArray();
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  await db.collection("lieux").updateMany({}, { $set: { migrated: false } });

  const total = await db.collection("lieux").countDocuments();
  let cpt = 0;
  while ((await countPlacesNotMigrated(db)) > 0) {
    const places = await getPlacesNotMigrated(db);

    if (!places?.length) {
      return;
    }

    cpt = cpt + places.length;
    logger.info(`${cpt}/${total} places migrated`);

    const bulkOperations = await Promise.all(
      places.map(async (place) => {
        const updatedServices = await updateServicesAfterPatch(
          place as ApiPlace
        );

        return {
          updateOne: {
            collection: "lieux",
            filter: { _id: place._id },
            update: {
              $set: {
                services_all: updatedServices,
                migrated: true,
              },
            },
          },
        };
      })
    );

    if (bulkOperations?.length > 0) {
      await db.collection("lieux").bulkWrite(bulkOperations);
    }

    logger.info(`Migrated batch of ${places.length} places`);
  }

  logger.info("Migration completed successfully");
  await db.collection("lieux").updateMany({}, { $unset: { migrated: null } });
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  await db.collection("lieux").findOne();
};
