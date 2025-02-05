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
import { CountryCodes, SupportedLanguagesCode } from "@soliguide/common";
import {
  ApiTranslatedFieldContent,
  ApiTranslatedPlaceContent,
} from "../src/translations/classes";

const message = "Create new fields for translation";

async function findPlacesIdsByCountry(
  db: Db,
  country: CountryCodes
): Promise<number[]> {
  if (!Object.values(CountryCodes).includes(country)) {
    throw new Error(`Invalid country code : ${country}`);
  }

  try {
    const pipeline = [
      {
        $match: {
          $or: [
            { "position.country": country },
            { "parcours.0.position.country": country },
          ],
        },
      },
      {
        $project: {
          lieu_id: 1,
        },
      },
      {
        $group: {
          _id: null,
          ids: { $push: "$lieu_id" },
        },
      },
    ];

    const result = await db.collection("lieux").aggregate(pipeline).toArray();

    const lieuIds = result[0]?.ids || [];

    logger.info(`${country} :  ${lieuIds.length} places`);

    return lieuIds;
  } catch (error) {
    logger.error(`Cannot get places for ${country} :`, error);
    throw error;
  }
}

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const spainIds = await findPlacesIdsByCountry(db, CountryCodes.ES);
  logger.info("🇪🇸 Migrate spain translated fields & places");

  const spainTranslatedFields = await db
    .collection("translatedFields")
    .updateMany(
      {
        lieu_id: { $in: spainIds },
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.CA,
          },
        },
        {
          $unset: [
            "languages.ps",
            "languages.ka",
            "languages.ca",
            "languages.fa",
            "languages.ru",
            "languages.ro",
          ],
        },
      ]
    );

  const spainTranslatedPlaces = await db
    .collection("translatedPlaces")
    .updateMany(
      {
        lieu_id: { $in: spainIds },
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.CA,
          },
        },
        {
          $unset: [
            "languages.ps",
            "languages.ka",
            "languages.ca",
            "languages.fa",
            "languages.ru",
            "languages.ro",
          ],
        },
      ]
    );

  logger.info(
    `${spainTranslatedFields.modifiedCount} translated fields updated `
  );
  logger.info(
    `${spainTranslatedPlaces.modifiedCount} translated places updated `
  );

  logger.info("🇦🇩 Migrate andorra's translated fields & places");

  const andorraIds = await findPlacesIdsByCountry(db, CountryCodes.AD);

  const andorraTranslatedFields = await db
    .collection("translatedFields")
    .updateMany(
      {
        lieu_id: { $in: andorraIds },
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.CA,
          },
        },
        {
          $unset: [
            "languages.ro",
            "languages.ka",
            "languages.ca",
            "languages.fa",
            "languages.ps",
            "languages.ru",
          ],
        },
      ]
    );

  const andorraTranslatedPlaces = await db
    .collection("translatedPlaces")
    .updateMany(
      {
        lieu_id: { $in: andorraIds },
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.CA,
          },
        },
        {
          $unset: [
            "languages.ro",
            "languages.ka",
            "languages.ca",
            "languages.fa",
            "languages.ps",
            "languages.ru",
          ],
        },
      ]
    );

  logger.info(`🇦🇩 ${andorraTranslatedFields.modifiedCount} fields updated `);
  logger.info(`🇦🇩 ${andorraTranslatedPlaces.modifiedCount} places updated `);

  logger.info("");
  logger.info("🇫🇷  Migrate France's translated fields & places");

  const francePlacesIds = await findPlacesIdsByCountry(db, CountryCodes.FR);

  const franceTranslatedFields = await db
    .collection("translatedFields")
    .updateMany(
      {
        lieu_id: { $in: francePlacesIds },
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.FR,
            "languages.ro": new ApiTranslatedFieldContent(),
          },
        },
      ]
    );

  const franceTranslatedPlaces = await db
    .collection("translatedPlaces")
    .updateMany(
      {
        "position.country": null,
      },
      [
        {
          $set: {
            sourceLanguage: SupportedLanguagesCode.FR,
            "languages.ro": new ApiTranslatedPlaceContent(),
          },
        },
        {
          $unset: ["needRebuild"],
        },
      ]
    );

  logger.info(`🇫🇷 ${franceTranslatedFields.modifiedCount} fields updated `);
  logger.info(`🇫🇷 ${franceTranslatedPlaces.modifiedCount} places updated `);
};

export const down = () => {
  logger.info(`[ROLLBACK] - ${message}`);
};
