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

const message =
  "Advance stuck NEED_AUTO_TRANSLATE documents whose configured languages are all already translated";

// Per-country configuration mirroring SUPPORTED_LANGUAGES_BY_COUNTRY.
// Each entry lists the languages that must ALL be translated before a document
// can advance from NEED_AUTO_TRANSLATE to NEED_HUMAN_TRANSLATE.
const COUNTRIES_CONFIG = [
  {
    sourceLanguage: "fr",
    otherLanguages: [
      "ar",
      "en",
      "es",
      "ru",
      "ps",
      "fa",
      "uk",
      "ca",
      "ka",
      "ro",
    ],
  },
  // ES and AD share the same source language (ca) and otherLanguages
  {
    sourceLanguage: "ca",
    otherLanguages: ["es", "fr", "en", "ar", "uk", "pt"],
  },
];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  await collection.createIndex({ content: 1, status: 1 });

  let advancedCount = 0;

  for (const { sourceLanguage, otherLanguages } of COUNTRIES_CONFIG) {
    const allTranslatedFilter: Record<string, unknown> = {
      status: "NEED_AUTO_TRANSLATE",
      sourceLanguage,
    };

    for (const lang of otherLanguages) {
      allTranslatedFilter[`languages.${lang}.auto.content`] = {
        $nin: [null, ""],
      };
    }

    const result = await collection.updateMany(allTranslatedFilter, {
      $set: { status: "NEED_HUMAN_TRANSLATE" },
    });

    advancedCount += result.modifiedCount;

    logger.info(
      `[MIGRATION] Advanced ${result.modifiedCount} stuck NEED_AUTO_TRANSLATE documents for sourceLanguage="${sourceLanguage}"`
    );
  }

  logger.info(`[MIGRATION] Total advanced: ${advancedCount} documents`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, status cannot be reverted`
  );
};
