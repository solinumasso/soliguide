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
import { deletePlace } from "../src/place/controllers";
import { AirtableEntity, AirtableEntityType } from "../src/_models";
import { AT_FIELDS_IDS, PLACE_STATUS } from "../src/airtable/constants";
import { updateRecords } from "../src/airtable/services/airtable.service";

const message = "Fix duplicates for Soligare integration";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const placesIdsToRemove = (
    await db
      .collection("lieux")
      .aggregate([
        { $unwind: "$sources" },
        { $unwind: "$sources.ids" },
        {
          $project: {
            source: { $concat: ["$sources.name", " - ", "$sources.ids.id"] },
            lieu_id: 1,
          },
        },
        { $group: { _id: "$source", lieuIds: { $addToSet: "$lieu_id" } } },
        { $match: { lieuIds: { $size: 2 } } },
        { $unwind: "$lieuIds" },
        { $group: { _id: "$_id", lieuIds: { $max: "$lieuIds" } } },
        { $group: { _id: null, idsToRemove: { $addToSet: "$lieuIds" } } },
      ])
      .toArray()
  )[0]?.idsToRemove;

  if (!placesIdsToRemove || placesIdsToRemove.length === 0) {
    logger.info("No duplicate places found to remove");
    return;
  }

  const placesToRemove = await db
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .collection<any>("lieux") // skipcq: JS-0323
    .find({ lieu_id: { $in: placesIdsToRemove } })
    .toArray();

  logger.info(`Found ${placesToRemove.length} duplicate places to remove`);

  const content: AirtableEntity = [];

  for (const place of await placesToRemove) {
    await deletePlace(place);

    const airtableId = place.atSync?.airtableId;

    if (airtableId) {
      content.push([
        {
          id: airtableId,
          fields: {
            [AT_FIELDS_IDS[AirtableEntityType.PLACE].status]:
              PLACE_STATUS.DELETED,
          },
        },
      ]);
    }
  }

  if (content.length) {
    await updateRecords(AirtableEntityType.PLACE, content);
  }
};

export const down = () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info("No rollback possible");
};
