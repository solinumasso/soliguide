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
import { PlaceStatus } from "@soliguide/common";
import { logger } from "../../../general/logger";

import { PlaceModel } from "../../../place/models/place.model";
import { DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH } from "../../../search/constants/requests";

export async function setOfflineJob(): Promise<void> {
  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tSTART");

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setHours(0);
  sixMonthsAgo.setMinutes(0);
  sixMonthsAgo.setSeconds(0);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  logger.info("Mise à jour des structures hors ligne");
  const request = {
    ...DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH,
    status: PlaceStatus.ONLINE,
    updatedByUserAt: { $lt: sixMonthsAgo },
  };

  await PlaceModel.updateMany(request, {
    $set: { status: PlaceStatus.OFFLINE },
  });

  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tEND");
}
