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

import { AirtableEntityType, CONFIG } from "../../../_models";
import { getEntitiesToSync } from "../../../airtable/services/airtableEntity.service";
import { syncAirtableRecords } from "../../../airtable/controllers/airtable.controller";

(async () => {
  try {
    logger.info("JOB - SYNC AT WITH SOLIGUIDE\tSTART");
    try {
      for (const airtableEntityType in AirtableEntityType) {
        const now = new Date();

        const entitiesToSync = await getEntitiesToSync(
          airtableEntityType as AirtableEntityType
        );

        const frontUrl = CONFIG.SOLIGUIDE_FR_URL;

        await syncAirtableRecords(
          frontUrl,
          entitiesToSync,
          airtableEntityType as AirtableEntityType,
          now
        );
      }

      if (parentPort) parentPort.postMessage("done");
    } catch (e) {
      logger.warn("FAIL SYNCHRO AT WITH SOLIGUIDE");
      logger.error(e);
      if (parentPort) parentPort.postMessage("error");
    }
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }
})();
