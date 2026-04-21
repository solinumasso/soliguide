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

const message = "Migrate old 'addiction' category to new taxonomy categories";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // 1. addiction -> addiction_care (description contains care-related keywords)
  const resultCare = await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: {
          category: "addiction",
          description: {
            $regex:
              "\\bAddictologie\\b|\\bsevrage\\b|\\baddictologue\\b|\\bconsultation addictologie\\b",
            $options: "i",
          },
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
                      { $eq: ["$$service.category", "addiction"] },
                      {
                        $regexMatch: {
                          input: "$$service.description",
                          regex:
                            "\\bAddictologie\\b|\\bsevrage\\b|\\baddictologue\\b|\\bconsultation addictologie\\b",
                          options: "i",
                        },
                      },
                    ],
                  },
                  {
                    $mergeObjects: [
                      "$$service",
                      { category: Categories.ADDICTION_CARE },
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
    `[MIGRATION] - addiction -> addiction_care: ${resultCare.matchedCount} matchés, ${resultCare.modifiedCount} modifiés`
  );

  // 2. addiction -> support_groups (Alcoholics Anonymous)
  const resultGroups = await db.collection("lieux").updateMany(
    {
      $or: [
        { name: { $regex: "\\bAlcooliques anonymes\\b", $options: "i" } },
        {
          services_all: {
            $elemMatch: {
              category: "addiction",
              description: {
                $regex: "\\bAlcooliques anonymes\\b",
                $options: "i",
              },
            },
          },
        },
      ],
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
                      { $eq: ["$$service.category", "addiction"] },
                      {
                        $or: [
                          {
                            $regexMatch: {
                              input: "$name",
                              regex: "\\bAlcooliques anonymes\\b",
                              options: "i",
                            },
                          },
                          {
                            $and: [
                              {
                                $not: {
                                  $regexMatch: {
                                    input: "$name",
                                    regex: "\\bAlcooliques anonymes\\b",
                                    options: "i",
                                  },
                                },
                              },
                              {
                                $regexMatch: {
                                  input: "$$service.description",
                                  regex: "\\bAlcooliques anonymes\\b",
                                  options: "i",
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $mergeObjects: [
                      "$$service",
                      { category: Categories.SUPPORT_GROUPS },
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
    `[MIGRATION] - addiction -> support_groups: ${resultGroups.matchedCount} matchés, ${resultGroups.modifiedCount} modifiés`
  );

  // 3. remaining addiction -> addiction_prevention_and_material (fallback)
  const resultPrevention = await db
    .collection("lieux")
    .updateMany({ services_all: { $elemMatch: { category: "addiction" } } }, [
      {
        $set: {
          services_all: {
            $map: {
              input: "$services_all",
              as: "service",
              in: {
                $cond: [
                  { $eq: ["$$service.category", "addiction"] },
                  {
                    $mergeObjects: [
                      "$$service",
                      {
                        category: Categories.ADDICTION_PREVENTION_AND_MATERIAL,
                      },
                    ],
                  },
                  "$$service",
                ],
              },
            },
          },
        },
      },
    ]);
  logger.info(
    `[MIGRATION] - addiction -> addiction_prevention_and_material: ${resultPrevention.matchedCount} matchés, ${resultPrevention.modifiedCount} modifiés`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const newCategories = [
    Categories.ADDICTION_CARE,
    Categories.SUPPORT_GROUPS,
    Categories.ADDICTION_PREVENTION_AND_MATERIAL,
  ];

  const result = await db
    .collection("lieux")
    .updateMany(
      { services_all: { $elemMatch: { category: { $in: newCategories } } } },
      [
        {
          $set: {
            services_all: {
              $map: {
                input: "$services_all",
                as: "service",
                in: {
                  $cond: [
                    { $in: ["$$service.category", newCategories] },
                    { $mergeObjects: ["$$service", { category: "addiction" }] },
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
    `[ROLLBACK] - addiction_care/support_groups/addiction_prevention_and_material -> addiction: ${result.matchedCount} matchés, ${result.modifiedCount} modifiés`
  );
};
