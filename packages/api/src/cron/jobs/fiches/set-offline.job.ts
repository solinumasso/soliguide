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
import "../../../config/database/connection";

import { CountryCodes, PlaceStatus } from "@soliguide/common";

import delay from "delay";

import { parentPort } from "worker_threads";

import { logger } from "../../../general/logger";

import { DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH } from "../../../search/constants/requests/DEFAULT_PLACES_FOR_SEARCH.const";

import { PlaceModel } from "../../../place/models/place.model";

(async () => {
  try {
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
      country: CountryCodes.FR,
    };

    await PlaceModel.updateMany(request, {
      $set: { status: PlaceStatus.OFFLINE },
    });

    await delay(500);

    logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tEND");
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  } finally {
    if (parentPort) parentPort.postMessage("done");
  }
})();
