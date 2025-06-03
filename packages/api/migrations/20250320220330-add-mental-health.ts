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
import { AnyBulkWriteOperation, Db } from "mongodb";

import { logger } from "../src/general/logger";
import {
  ApiPlace,
  OTHER_DEFAULT_VALUES,
  PublicsOther,
} from "@soliguide/common";
import {
  countElementsToMigrate,
  resetMigrationFlag,
} from "./utils/migration-flags";

const message = "Add mental health to publics";

const PUBLICS_LENGTH = OTHER_DEFAULT_VALUES.length - 1; // New field is in default values, so we have to subtract
const MONGO_QUERY = {
  $or: [
    {
      $expr: {
        $eq: [{ $size: "$publics.other" }, PUBLICS_LENGTH],
      },
    },
    {
      $expr: {
        $eq: [{ $size: "$services_all.publics.other" }, PUBLICS_LENGTH],
      },
    },
  ],
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  logger.info("Add migration flag for this migration");
  await resetMigrationFlag(db, "lieux", MONGO_QUERY);

  const elementsToMigrate = await countElementsToMigrate(
    db,
    "lieux",
    MONGO_QUERY
  );

  console.log(MONGO_QUERY);
  console.log(elementsToMigrate);
  if (!elementsToMigrate) {
    throw new Error("xx");
  }
  logger.warn(`${elementsToMigrate} elements to migrate`);
  let i = 0;

  while (
    (await countElementsToMigrate(db, "lieux", {
      ...MONGO_QUERY,
      migrated: false,
    })) > 0
  ) {
    const bulkOps: AnyBulkWriteOperation[] = [];

    const places = await db
      .collection<ApiPlace>("lieux")
      .find(
        { ...MONGO_QUERY, migrated: false },
        {
          projection: {
            services_all: 1,
            publics: 1,
            lieu_id: 1,
            name: 1,
          },
        }
      )
      .limit(1500)
      .toArray();

    for (const place of places) {
      if (place.publics.other.length === PUBLICS_LENGTH) {
        place.publics.other.push(PublicsOther.mentalHealth);
      }

      // Fix old corrupted values: other must have at least one value
      if (place.publics.other.length === 0) {
        place.publics.other = structuredClone(OTHER_DEFAULT_VALUES);
      }

      for (const service of place.services_all) {
        if (service.publics.other.length === 0) {
          service.publics.other = structuredClone(OTHER_DEFAULT_VALUES);
        }

        if (!service.differentPublics) {
          service.publics = structuredClone(place.publics);
        }

        if (service.publics.other.length === PUBLICS_LENGTH) {
          service.publics.other.push(PublicsOther.mentalHealth);
        }
      }

      bulkOps.push({
        updateOne: {
          filter: { lieu_id: place.lieu_id },
          update: {
            $set: {
              migrated: true,
              publics: place.publics,
              services_all: place.services_all,
            },
          },
          upsert: false,
        },
      });

      if (bulkOps.length === 500 || i === places.length - 1) {
        await db.collection("lieux").bulkWrite(bulkOps);
        logger.info(`Batch update of publics: ${i}/${elementsToMigrate}`);
        bulkOps.length = 0;
      }

      i++;
    }

    if (bulkOps.length) {
      await db.collection("lieux").bulkWrite(bulkOps);
      logger.info(`Batch update of publics: ${i}/${elementsToMigrate}`);
    }
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  await db.collection("lieux").findOne();
};
