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
import {
  CAMPAIGN_DEFAULT_NAME,
  PAIRING_SOURCES,
  PairingSources,
} from "@soliguide/common";

import { Db, ObjectId } from "mongodb";
import { logger } from "../src/general/logger";

const message =
  "Add default value for users, orga and places for mid year update of 2025";

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  logger.warn(`[MIGRATION] - ${message}`);

  logger.info(`Reset field 'campaigns.${CAMPAIGN_DEFAULT_NAME}' in places`);

  logger.info("[MIGRATION] [RESET] Add 'toUpdate' to places online & offline");
  await db.collection("lieux").updateMany(
    {
      sources: {
        $elemMatch: {
          $or: [
            { name: "Croix-Rouge française" },
            {
              name: {
                $in: PAIRING_SOURCES.filter(
                  (source) => source !== PairingSources.CRF
                ),
              },
              isOrigin: true,
            },
          ],
        },
      },
    },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false,
      },
    }
  );

  logger.info(
    `[MIGRATION] [RESET] Reset field 'campaigns.${CAMPAIGN_DEFAULT_NAME}' in organizations`
  );

  const places = await db
    .collection("lieux")
    .find({ [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false })
    .project({ _id: 1 })
    .toArray();

  const placeIds = places.map((place: { _id: ObjectId }) => place._id);

  logger.info(
    "[MIGRATION] [RESET] Add 'toUpdate' to organizations with places to update"
  );
  await db.collection("organization").updateMany(
    { places: { $in: placeIds } },
    {
      $set: {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false,
      },
    }
  );
};
