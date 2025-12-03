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
import { CAMPAIGN_DEFAULT_NAME, PlaceType } from "@soliguide/common";

import { Db, ObjectId } from "mongodb";
import { logger } from "../src/general/logger";

const message = "Include parcours into end year MAJ 2025";

export const down = () => {
  logger.info(`[ROLLBACK] - NO ROLLBACK`);
};

export const up = async (db: Db) => {
  logger.warn(`[MIGRATION] - ${message}`);

  const placesUpdated = await db.collection("lieux").updateMany(
    {
      placeType: PlaceType.ITINERARY,
    },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
        "atSync.lastSync": null,
      },
    }
  );

  logger.info(
    `[MIGRATION] - ${placesUpdated.modifiedCount} parcours included in MAJ`
  );

  const places = await db
    .collection("lieux")
    .find({ [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true })
    .project({ _id: 1 })
    .toArray();

  const placeIds = places.map((place: { _id: ObjectId }) => place._id);

  const orgaUpdated = await db.collection("organization").updateMany(
    { places: { $in: placeIds } },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
      },
    }
  );

  logger.info(
    `[MIGRATION] - ${orgaUpdated.modifiedCount} wasn't concerned by MAJ and now included`
  );
};
