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
  CategoriesSpecificFields,
  CommonNewPlaceService,
} from "@soliguide/common";

const message = "Repare category specific fields type";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // This variable comes from the frontend
  const categorySpecificFieldsEnumNames: Partial<
    keyof CategoriesSpecificFields
  >[] = [
    "courseType",
    "domiciliationType",
    "hygieneProductType",
    "canteensMealType",
    "dietaryRegimesType",
    "nationalOriginProductType",
    "organicOriginProductType",
    "voucherType",
    "degreeOfChoiceType",
  ];
  for (const categorySpecificFieldEnumName of categorySpecificFieldsEnumNames) {
    logger.info(
      `Updating category specific field: ${categorySpecificFieldEnumName}`
    );

    logger.info("Remove empty arrays");
    logger.info(
      `${await db.collection("lieux").countDocuments({
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array", $size: 0 },
      })} places to update`
    );

    await db.collection("lieux").updateMany(
      {
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array", $size: 0 },
      },
      {
        $unset: {
          [`services_all.$[service].categorySpecificFields.${categorySpecificFieldEnumName}`]: 1,
        },
      },
      {
        arrayFilters: [
          {
            [`service.categorySpecificFields.${categorySpecificFieldEnumName}`]:
              { $exists: true, $type: "array", $size: 0 },
          },
        ],
      }
    );

    logger.info(
      `${await db.collection("lieux").countDocuments({
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array", $size: 0 },
      })} places to still update after migration`
    );

    logger.info("Repair filled arrays");

    logger.info(
      `${await db.collection("lieux").countDocuments({
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array" },
      })} places to update`
    );

    const bulkQuery = [];

    const places = await db
      .collection("lieux")
      .find({
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array" },
      })
      .toArray();

    for (const place of places) {
      bulkQuery.push({
        updateOne: {
          filter: { _id: place._id },
          update: {
            $set: place.services_all.reduce(
              (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                acc: Record<string, any>, // skipcq: JS-0323
                service: CommonNewPlaceService,
                index: number
              ) => {
                if (
                  service.categorySpecificFields?.[
                    categorySpecificFieldEnumName
                  ] &&
                  Array.isArray(
                    service.categorySpecificFields?.[
                      categorySpecificFieldEnumName
                    ]
                  )
                ) {
                  acc[
                    `services_all.${index}.categorySpecificFields.${categorySpecificFieldEnumName}`
                  ] =
                    service.categorySpecificFields?.[
                      categorySpecificFieldEnumName
                    ][0];
                }

                return acc;
              },
              {}
            ),
          },
        },
      });
    }

    if (bulkQuery.length) {
      await db.collection("lieux").bulkWrite(bulkQuery);
    }

    logger.info(
      `${await db.collection("lieux").countDocuments({
        [`services_all.categorySpecificFields.${categorySpecificFieldEnumName}`]:
          { $exists: true, $type: "array" },
      })} places to still update after migration`
    );
  }
};

export const down = () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info("NO ROLLBACK NEEDED");
};
