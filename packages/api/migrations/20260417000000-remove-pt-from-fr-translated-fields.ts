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

import {
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  CountryCodes,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { logger } from "../src/general/logger";

// PT was incorrectly added to FR documents by migration 20260218130905 which lacked
// a country filter. PT is not in FR's SUPPORTED_LANGUAGES_BY_COUNTRY config.
const lang = SupportedLanguagesCode.PT;
const country = CountryCodes.FR;

const { source: sourceLanguage } = SUPPORTED_LANGUAGES_BY_COUNTRY[country];

const message = `Remove ${lang} from ${country} translatedFields and translatedPlaces`;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const fieldCol = db.collection("translatedFields");
  const placeCol = db.collection("translatedPlaces");

  const fieldFilter = {
    sourceLanguage,
    [`languages.${lang}`]: { $exists: true },
  };
  const placeFilter = {
    sourceLanguage,
    [`languages.${lang}`]: { $exists: true },
  };

  // Before
  const beforeFields = await fieldCol.countDocuments(fieldFilter);
  const beforePlaces = await placeCol.countDocuments(placeFilter);
  logger.info(
    `[MIGRATION] Before: ${beforeFields} translatedFields, ${beforePlaces} translatedPlaces to update`
  );

  await fieldCol.updateMany(fieldFilter, {
    $unset: { [`languages.${lang}`]: "" },
  });
  await placeCol.updateMany(placeFilter, {
    $unset: { [`languages.${lang}`]: "" },
  });

  // After — should both be 0
  const afterFields = await fieldCol.countDocuments(fieldFilter);
  const afterPlaces = await placeCol.countDocuments(placeFilter);

  if (afterFields > 0 || afterPlaces > 0) {
    throw new Error(
      `[MIGRATION] ERROR: ${afterFields} translatedFields and ${afterPlaces} translatedPlaces ` +
        `from ${country} still carry ${lang} after removal — investigate immediately`
    );
  }

  logger.info(
    `[MIGRATION] Sanity check passed: no ${country} documents carry ${lang} anymore`
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  // PT was never supposed to be on FR documents; there is no meaningful rollback.
  logger.info(
    `[ROLLBACK] - ${message} — no rollback: PT was incorrectly present on FR and should not be restored`
  );
};
