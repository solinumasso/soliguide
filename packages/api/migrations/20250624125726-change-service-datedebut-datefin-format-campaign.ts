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

const message = "Convert numeric dateDebut/dateFin to Date in placeChanges";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const places = await db
    .collection("placeChanges")
    .find({
      $or: [
        { "new.close.dateDebut": { $type: "number" } },
        { "new.close.dateFin": { $type: "number" } },
        { "old.close.dateDebut": { $type: "number" } },
        { "old.close.dateFin": { $type: "number" } },
      ],
    })
    .toArray();

  logger.info(`[MIGRATION] - Found ${places.length} docs with numeric dates`);

  const fieldsToProcess = [
    { context: "new", field: "dateDebut" },
    { context: "new", field: "dateFin" },
    { context: "old", field: "dateDebut" },
    { context: "old", field: "dateFin" },
  ] as const;

  for (const { context, field } of fieldsToProcess) {
    logger.info(`[MIGRATION] - Processing ${context}.${field}`);

    const bulkQuery = [];

    for (const place of places) {
      bulkQuery.push({
        updateOne: {
          filter: { _id: place._id },
          update: {
            $set: place[context].reduce(
              (
                acc: Record<string, Date>,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: any, // skipcq: JS-0323
                index: number
              ) => {
                if (value.close && typeof value.close[field] === "number") {
                  acc[`${context}.${index}.close.${field}`] = new Date(
                    value.close[field]
                  );
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
      const result = await db.collection("placeChanges").bulkWrite(bulkQuery);
      logger.info(
        `[MIGRATION] - Updated ${result.modifiedCount} docs for ${context}.${field}`
      );
    } else {
      logger.info(`[MIGRATION] - No docs to update for ${context}.${field}`);
    }
  }
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message} - no rollback implemented`);
};
