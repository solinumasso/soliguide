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

import "../../../place/models/document.model";
import "../../../place/models/photo.model";
import "../../../place/models/place.model";
import "../../../place/models/opening-hours.model";
import "../../../translations/models/translatedField.model";
import "../../../translations/models/translatedPlace.model";

import delay from "delay";
import { parentPort } from "worker_threads";
import { logger } from "../../../general/logger";
import { importCategories } from "../../../place/utils/importCategories";

(async () => {
  logger.info("[IMPORT CATEGORIES]: Start import");

  try {
    await importCategories();
  } catch (e) {
    logger.error(e, "ERROR IMPORT CATEGORIES");
    await delay(500);
    if (parentPort) parentPort.postMessage("ERROR IMPORT CATEGORIES");
  } finally {
    if (parentPort) parentPort.postMessage("done");
  }
})();
