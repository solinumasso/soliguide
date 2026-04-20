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

const message = "Migrate old 'std_testing' category to new taxonomy categories";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // std_testing -> sti_prevention_testing (description does not contain cancer/tuberculosis-related words)
  const result = await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: {
          category: "std_testing",
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
                  {
                    $and: [
                      { $eq: ["$$service.category", "std_testing"] },
                      {
                        $not: {
                          $regexMatch: {
                            input: "$$service.description",
                            regex:
                              "cancer|tuberculose|dépistage cancer|dépistage pulmonaire|mammographie|coloscopie|frottis cancer",
                            options: "i",
                          },
                        },
                      },
                    ],
                  },
                  {
                    $mergeObjects: [
                      "$$service",
                      { category: Categories.STI_PREVENTION_TESTING },
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
    `[MIGRATION] - std_testing -> sti_prevention_testing: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const result = await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: { category: Categories.STI_PREVENTION_TESTING },
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
                  {
                    $eq: [
                      "$$service.category",
                      Categories.STI_PREVENTION_TESTING,
                    ],
                  },
                  {
                    $mergeObjects: ["$$service", { category: "std_testing" }],
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
    `[ROLLBACK] - sti_prevention_testing -> std_testing: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};
