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
import { fromUnixTime } from "date-fns";
import { logger } from "../src/general/logger";

const message =
  "Convert numeric dateDebut/dateFin to Date in lieux (tempInfos)";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const lieux = await db
    .collection("lieux")
    .find({
      $or: [
        { "tempInfos.closure.dateDebut": { $type: "number" } },
        { "tempInfos.closure.dateFin": { $type: "number" } },
        { "tempInfos.hours.dateDebut": { $type: "number" } },
        { "tempInfos.hours.dateFin": { $type: "number" } },
        { "tempInfos.message.dateDebut": { $type: "number" } },
        { "tempInfos.message.dateFin": { $type: "number" } },
      ],
    })
    .toArray();

  logger.info(
    `[MIGRATION] - lieux: Found ${lieux.length} documents to process`
  );

  let updatedClosures = 0;
  let updatedHours = 0;
  let updatedMessages = 0;

  for (const doc of lieux) {
    const tempInfos = doc.tempInfos || {};
    let hasChanges = false;

    // Closures
    if (Array.isArray(tempInfos.closure)) {
      tempInfos.closure = tempInfos.closure.map((item: any) => {
        const updated = { ...item };
        if (typeof updated.dateDebut === "number") {
          updated.dateDebut = fromUnixTime(updated.dateDebut / 1000);
          updatedClosures++;
          hasChanges = true;
        }
        if (typeof updated.dateFin === "number") {
          updated.dateFin = fromUnixTime(updated.dateFin / 1000);
          updatedClosures++;
          hasChanges = true;
        }
        return updated;
      });
    }

    // Hours
    if (Array.isArray(tempInfos.hours)) {
      tempInfos.hours = tempInfos.hours.map((item: any) => {
        const updated = { ...item };
        if (typeof updated.dateDebut === "number") {
          updated.dateDebut = fromUnixTime(updated.dateDebut / 1000);
          updatedHours++;
          hasChanges = true;
        }
        if (typeof updated.dateFin === "number") {
          updated.dateFin = fromUnixTime(updated.dateFin / 1000);
          updatedHours++;
          hasChanges = true;
        }
        return updated;
      });
    }

    // Messages
    if (Array.isArray(tempInfos.message)) {
      tempInfos.message = tempInfos.message.map((item: any) => {
        const updated = { ...item };
        if (typeof updated.dateDebut === "number") {
          updated.dateDebut = fromUnixTime(updated.dateDebut / 1000);
          updatedMessages++;
          hasChanges = true;
        }
        if (typeof updated.dateFin === "number") {
          updated.dateFin = fromUnixTime(updated.dateFin / 1000);
          updatedMessages++;
          hasChanges = true;
        }
        return updated;
      });
    }

    if (hasChanges) {
      await db
        .collection("lieux")
        .updateOne({ _id: doc._id }, { $set: { tempInfos } });
    }
  }

  logger.info(`[MIGRATION] - lieux: Updated ${updatedClosures} closure dates`);
  logger.info(`[MIGRATION] - lieux: Updated ${updatedHours} hours dates`);
  logger.info(`[MIGRATION] - lieux: Updated ${updatedMessages} message dates`);
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message} - no rollback implemented`);
};
