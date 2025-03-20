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
import "../../../user/models/user.model";
import "../../../place/models/place.model";

import delay from "delay";

import { parentPort } from "worker_threads";

import { logger } from "../../../general/logger";

import { generateRemindMeEmails } from "../../../emailing/controllers/campaign-email.controller";
import { sendCampaignEmails } from "../../../emailing/senders";
import { CONFIG } from "../../../_models";

(async () => {
  logger.info("[EMAILS] Sending emails");

  const frontUrl = CONFIG.SOLIGUIDE_FR_URL;

  try {
    await generateRemindMeEmails(frontUrl);
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  try {
    await sendCampaignEmails("REMIND_ME");
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  logger.info("[EMAILS] All emails sent");
  await delay(1000);
  if (parentPort) parentPort.postMessage("done");
})();
