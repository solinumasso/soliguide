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
import {
  ApiPlace,
  OTHER_DEFAULT_VALUES,
  PublicsOther,
  publicsValuesAreCoherent,
  WelcomedPublics,
} from "@soliguide/common";

const message = "Delete ukraine refugees";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkOps: any = [];

  const places: ApiPlace[] = await db
    .collection("lieux")
    .find<ApiPlace>(
      {
        $or: [
          { "publics.other": { $elemMatch: { $eq: "ukraine" } } },
          { "services_all.publics.other": { $elemMatch: { $eq: "ukraine" } } },
        ],
      },
      {
        projection: {
          services_all: 1,
          publics: 1,
          lieu_id: 1,
        },
      }
    )

    .toArray();

  logger.info(`${places.length} places to update`);

  const exclusive = [];
  const preferentiel = [];
  const unconditional = [];
  const invalid = [];

  let i = 0;

  for (const place of places) {
    place.publics.other = place.publics.other.filter(
      (item) => item !== PublicsOther.ukraine
    );

    // Fix old corrupted values: other must have at least one value
    if (place.publics.other.length === 0) {
      place.publics.other = structuredClone(OTHER_DEFAULT_VALUES);
    }

    if (place.publics.accueil === WelcomedPublics.UNCONDITIONAL) {
      unconditional.push(place.publics);
    } else if (place.publics.accueil === WelcomedPublics.EXCLUSIVE) {
      exclusive.push(place.publics);
    } else {
      preferentiel.push(place.publics);
    }

    if (!publicsValuesAreCoherent(place.publics)) {
      invalid.push(place.publics);
    }

    for (const service of place.services_all) {
      service.publics.other = service.publics.other.filter(
        (item) => item !== PublicsOther.ukraine
      );
      // Fix old corrupted values: other must have at least one value
      if (service.publics.other.length === 0) {
        service.publics.other = structuredClone(OTHER_DEFAULT_VALUES);
      }

      if (!publicsValuesAreCoherent(service.publics)) {
        invalid.push(service.publics);
      }
    }

    bulkOps.push({
      updateOne: {
        filter: { lieu_id: place.lieu_id },
        update: {
          $set: {
            publics: place.publics,
            services_all: place.services_all,
          },
        },
        upsert: false,
      },
    });

    if (bulkOps.length === 500 || i === places.length - 1) {
      await db.collection("lieux").bulkWrite(bulkOps);
      console.log(`Batch update of publics: ${i}/${places.length}`);
      bulkOps.length = 0;
    }

    i++;
  }

  console.log("unconditional : " + unconditional.length);
  console.log("exclusive : " + exclusive.length);
  console.log("preferentiel : " + preferentiel.length);
  console.log("invalid : " + invalid.length);
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  await db.collection("lieux").findOne();
};
