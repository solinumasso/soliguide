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
  "Fix translation duplicates: propagate best translations to NEED_AUTO_TRANSLATE records sharing the same content";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  // Get all content values that are still waiting for auto-translation
  const contents = await collection.distinct("content", {
    status: "NEED_AUTO_TRANSLATE",
  });

  logger.info(
    `[MIGRATION] Found ${contents.length} unique content values with NEED_AUTO_TRANSLATE records`
  );

  let updatedCount = 0;

  for (const content of contents) {
    // Find the best already-translated record for this content.
    // Alphabetical descending sort naturally gives the right preference:
    // TRANSLATION_COMPLETE (T…) > NEED_HUMAN_TRANSLATE (N…H…) > NEED_AUTO_TRANSLATE
    const best = await collection.findOne(
      {
        content,
        status: { $in: ["NEED_HUMAN_TRANSLATE", "TRANSLATION_COMPLETE"] },
      },
      { sort: { status: -1 } }
    );

    if (!best) continue; // No translated version yet — cron will handle it

    const result = await collection.updateMany(
      { content, status: "NEED_AUTO_TRANSLATE" },
      { $set: { languages: best.languages, status: best.status } }
    );

    updatedCount += result.modifiedCount;
  }

  logger.info(`[MIGRATION] Updated ${updatedCount} translatedField documents`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, translations cannot be un-propagated`
  );
};
