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

import { parentPort } from "worker_threads";
import { logger } from "../../../general/logger";
import { PlaceOpeningStatus } from "../../../_models/airtable/airtableFieldValue.type";
import { syncAirtableRecordPlaceIsOpened } from "../../../airtable/controllers/airtable.controller";

import { findPlacesByParams } from "../../../place/services/place.service";

(async () => {
  try {
    logger.info("JOB - SYNC PLACE CLOSING STATUS\tSTART");

    const entitiesToSync = await findPlacesByParams({ isOpenToday: false });

    if (entitiesToSync) {
      for (let i = 0; i < entitiesToSync.length; i += 10) {
        await syncAirtableRecordPlaceIsOpened(
          entitiesToSync.slice(i, i + 10),
          PlaceOpeningStatus.CLOSED
        );
      }
    }

    if (parentPort) parentPort.postMessage("done");
  } catch (e) {
    logger.error(e);
    if (parentPort) {
      parentPort.postMessage("Error while running job");
      parentPort.postMessage("done");
    }
  }
})();
