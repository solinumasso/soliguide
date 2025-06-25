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
import { isValid } from "date-fns";
import { logger } from "../src/general/logger";

const message = "Convert numeric dateDebut/dateFin to Date in placeChanges";

type CloseItem = {
  close?: {
    dateDebut?: number | Date;
    dateFin?: number | Date;
    [key: string]: any;
  };
  [key: string]: any;
};

function convertDates(data: CloseItem[]): {
  updated: CloseItem[];
  hasChanges: boolean;
} {
  let hasChanges = false;

  const updated = data.map((item) => {
    if (!item.close) return item;

    const close = { ...item.close };

    if (typeof close.dateDebut === "number") {
      const d = new Date(close.dateDebut);
      if (isValid(d)) {
        close.dateDebut = d;
        hasChanges = true;
      }
    }

    if (typeof close.dateFin === "number") {
      const d = new Date(close.dateFin);
      if (isValid(d)) {
        close.dateFin = d;
        hasChanges = true;
      }
    }

    return { ...item, close };
  });

  return { updated, hasChanges };
}

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const [newDateDebutDocs, newDateFinDocs, oldDateDebutDocs, oldDateFinDocs] =
    await Promise.all([
      db
        .collection("placeChanges")
        .find({ "new.close.dateDebut": { $type: "number" } })
        .toArray(),
      db
        .collection("placeChanges")
        .find({ "new.close.dateFin": { $type: "number" } })
        .toArray(),
      db
        .collection("placeChanges")
        .find({ "old.close.dateDebut": { $type: "number" } })
        .toArray(),
      db
        .collection("placeChanges")
        .find({ "old.close.dateFin": { $type: "number" } })
        .toArray(),
    ]);

  const allDocs = [
    ...newDateDebutDocs,
    ...newDateFinDocs,
    ...oldDateDebutDocs,
    ...oldDateFinDocs,
  ];

  const uniqueDocs = Object.values(
    allDocs.reduce((acc, doc) => {
      acc[doc._id.toString()] = doc;
      return acc;
    }, {} as Record<string, any>)
  );

  logger.info(
    `[MIGRATION] - Found ${uniqueDocs.length} unique documents to process`
  );

  const bulkOps = [];

  for (const doc of uniqueDocs) {
    const { updated: updatedNew, hasChanges: newChanged } = convertDates(
      doc.new || []
    );
    const { updated: updatedOld, hasChanges: oldChanged } = convertDates(
      doc.old || []
    );

    if (newChanged || oldChanged) {
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              new: updatedNew,
              old: updatedOld,
            },
          },
        },
      });
    }
  }

  if (bulkOps.length > 0) {
    const res = await db.collection("placeChanges").bulkWrite(bulkOps);
    logger.info(
      `[MIGRATION] - Updated ${res.modifiedCount} placeChanges documents`
    );
  } else {
    logger.info(`[MIGRATION] - No documents needed to be updated`);
  }

  const remainingInvalidCount = await db
    .collection("placeChanges")
    .countDocuments({
      $or: [
        { "new.close.dateDebut": { $exists: true, $not: { $type: "date" } } },
        { "new.close.dateFin": { $exists: true, $not: { $type: "date" } } },
        { "old.close.dateDebut": { $exists: true, $not: { $type: "date" } } },
        { "old.close.dateFin": { $exists: true, $not: { $type: "date" } } },
      ],
    });

  logger.info(`[CHECK] - ${remainingInvalidCount} documents aren't dates`);
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message} - no rollback implemented`);
};
