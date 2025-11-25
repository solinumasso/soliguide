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
import {
  CAMPAIGN_DEFAULT_NAME,
  Categories,
  PlaceType,
} from "@soliguide/common";

import { Db, ObjectId } from "mongodb";
import { logger } from "../src/general/logger";

const message =
  "Add default value for users, orga and places for end year update 2025";

export const down = () => {
  logger.info(`[ROLLBACK] - NO ROLLBACK`);
};

export const up = async (db: Db) => {
  logger.warn(`[MIGRATION] - ${message}`);

  await db.collection("lieux").updateMany(
    {
      $or: [
        {
          services_all: { $size: 1 },
          "services_all.category": {
            $in: [
              Categories.TOILETS,
              Categories.WIFI,
              Categories.ELECTRICAL_OUTLETS_AVAILABLE,
              Categories.FOUNTAIN,
            ],
          },
        },
        {
          placeType: PlaceType.ITINERARY,
        },
      ],
    },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false,
      },
    }
  );

  const places = await db
    .collection("lieux")
    .find({ [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true })
    .project({ _id: 1 })
    .toArray();

  const placeIds = places.map((place: { _id: ObjectId }) => place._id);

  await db.collection("organization").updateMany(
    { places: { $in: placeIds } },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
      },
    }
  );
  logger.info(
    `[MIGRATION] [RESET] Reset 'campaigns.${CAMPAIGN_DEFAULT_NAME}' in users`
  );
};
