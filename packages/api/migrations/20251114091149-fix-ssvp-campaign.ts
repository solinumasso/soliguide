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
import {
  CAMPAIGN_DEFAULT_NAME,
  PairingSources,
  PlaceStatus,
} from "@soliguide/common";

const message = "Set all SSVP places to update for the campaign";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const update = await db.collection("lieux").updateMany(
    {
      status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
      $or: [
        { "sources.name": PairingSources.SSVP },
        { "sources.name": PairingSources.CD59 },
      ],
    },
    { $set: { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true } }
  );

  logger.info(`[MIGRATION] - Updated ${update.modifiedCount} places`);
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const update = await db.collection("lieux").updateMany(
    {
      "sources.isOrigin": true,
      $or: [
        { "sources.name": PairingSources.SSVP },
        { "sources.name": PairingSources.CD59 },
      ],
    },
    { $set: { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: false } }
  );

  logger.info(`[MIGRATION] - Updated ${update.modifiedCount} places`);
};
