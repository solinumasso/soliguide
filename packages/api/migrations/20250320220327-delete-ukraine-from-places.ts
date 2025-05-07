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
  // getPosition,
  OTHER_DEFAULT_VALUES,
  PlaceStatus,
  PublicsOther,
  publicsValuesAreCoherent,
  WelcomedPublics,
} from "@soliguide/common";
// import { createWriteStream } from "node:fs";
import { PlaceType } from "@soliguide/common";

const message = "Delete ukraine refugees";
export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // const csvStream = createWriteStream("invalid_publics_details.csv");
  // csvStream.write("LIEU ID,NOM,DEPARTEMENT,VILLE,CATEGORY\n");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkOps: any = [];

  // Récupération des lieux
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
          name: 1,
          position: 1,
          placeType: 1,
          parcours: 1,
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
    if (
      place.status === PlaceStatus.ONLINE &&
      place.placeType === PlaceType.ITINERARY &&
      !place?.parcours
    ) {
      console.error("No parcours for " + place._id);
      i++;
      continue;
    }

    if (
      place.status === PlaceStatus.ONLINE &&
      place.placeType === PlaceType.PLACE &&
      !place?.position
    ) {
      console.error("No position for " + place._id);
      i++;
      continue;
    }

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

    // const position = getPosition(place);
    // const departmentCode = position?.departmentCode ?? "";
    // const city = position?.city ?? "";

    if (!publicsValuesAreCoherent(place.publics)) {
      invalid.push(place.publics);

      // const placeLine = [
      //   place.lieu_id,
      //   escapeCsvValue(place.name),
      //   departmentCode ?? "",
      //   city ?? "",
      //   "",
      // ].join(",");
      // csvStream.write(placeLine + "\n");
    }

    for (const service of place.services_all) {
      // Copy place's publics before check
      if (!service.differentPublics) {
        service.publics = structuredClone(place.publics);
      }

      service.publics.other = service.publics.other.filter(
        (item) => item !== PublicsOther.ukraine
      );

      // Fix old corrupted values: other must have at least one value
      if (service.publics.other.length === 0) {
        service.publics.other = structuredClone(OTHER_DEFAULT_VALUES);
      }

      if (!publicsValuesAreCoherent(service.publics)) {
        invalid.push(service.publics);

        // const serviceLine = [
        //   place.lieu_id,
        //   escapeCsvValue(place.name),
        //   departmentCode ?? "",
        //   city ?? "",
        //   service.category || "",
        // ].join(",");
        // csvStream.write(serviceLine + "\n");
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
      logger.info(`Batch update of publics: ${i}/${places.length}`);
      bulkOps.length = 0;
    }

    i++;
  }

  // csvStream.end();

  logger.info("Statistiques:");
  logger.info(`Unconditional: ${unconditional.length}`);
  logger.info(`Exclusive: ${exclusive.length}`);
  logger.info(`Preferentiel: ${preferentiel.length}`);
  logger.info(`Total invalides: ${invalid.length}`);

  // if (invalid.length > 0) {
  //   logger.info(
  //     "Details for invalid publics are in invalid_publics_details.csv"
  //   );
  // }
};

// function escapeCsvValue(value: unknown) {
//   if (value === null || value === undefined) return "";
//   const strValue = String(value);
//   if (strValue.includes(",") || strValue.includes('"')) {
//     return `"${strValue.replace(/"/g, '""')}"`;
//   }
//   return strValue;
// }

export const down = () => {
  logger.info("NO ROLLBACK POSSIBLE");
};
