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
import { Db, ObjectId } from "mongodb";

import { logger } from "../src/general/logger";
import { CAMPAIGN_DEFAULT_NAME, Categories } from "@soliguide/common";

const message =
  "Exclude places with 2 services (WiFi, Toilets, Fountain, Electrical outlets available) from MAJ 2025";

export const up = async (db: Db) => {
  logger.warn(`[MIGRATION] - ${message}`);

  const placesUpdated = await db.collection("lieux").updateMany(
    {
      $expr: {
        $or: [
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.TOILETS],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.ELECTRICAL_OUTLETS_AVAILABLE],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.TOILETS, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.TOILETS, Categories.ELECTRICAL_OUTLETS_AVAILABLE],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.TOILETS, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.WIFI,
                    Categories.TOILETS,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.WIFI,
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.TOILETS,
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 4] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.WIFI,
                    Categories.TOILETS,
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
        ],
      },
    },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false,
        "atSync.lastSync": null,
      },
    }
  );

  logger.info(
    `[MIGRATION] - ${placesUpdated.modifiedCount} places with 2 services or more with only (WiFi, Toilets, Fountain, Electrical outlets available) excluded from MAJ`
  );

  const places = await db
    .collection("lieux")
    .find({ [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true })
    .project({ _id: 1 })
    .toArray();

  const placeIds = places.map((place: { _id: ObjectId }) => place._id);

  await db.collection("organization").updateMany(
    {},
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false,
      },
    }
  );

  const orgaUpdated = await db.collection("organization").updateMany(
    { places: { $in: placeIds } },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
      },
    }
  );

  logger.info(
    `[MIGRATION] - ${orgaUpdated.modifiedCount} wasn't concerned by MAJ and now included`
  );
};

export const down = () => {
  logger.info("[ROLLBACK] - NO ROLLBACK");
};
