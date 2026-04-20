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

import { Categories } from "@soliguide/common";

import { logger } from "../src/general/logger";

const message =
  "Migrate old 'ophthalmology' category to new taxonomy categories";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // ophthalmology -> optical_care
  const result = await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: {
          category: "ophthalmology",
        },
      },
    },
    [
      {
        $set: {
          services_all: {
            $map: {
              input: "$services_all",
              as: "service",
              in: {
                $cond: [
                  { $eq: ["$$service.category", "ophthalmology"] },
                  {
                    $mergeObjects: [
                      "$$service",
                      { category: Categories.OPTICAL_CARE },
                    ],
                  },
                  "$$service",
                ],
              },
            },
          },
        },
      },
    ]
  );
  logger.info(
    `[MIGRATION] - ophthalmology -> optical_care: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const result = await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: { category: Categories.OPTICAL_CARE },
      },
    },
    [
      {
        $set: {
          services_all: {
            $map: {
              input: "$services_all",
              as: "service",
              in: {
                $cond: [
                  { $eq: ["$$service.category", Categories.OPTICAL_CARE] },
                  {
                    $mergeObjects: [
                      "$$service",
                      { category: "ophthalmology" },
                    ],
                  },
                  "$$service",
                ],
              },
            },
          },
        },
      },
    ]
  );
  logger.info(
    `[ROLLBACK] - optical_care -> ophthalmology: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};
