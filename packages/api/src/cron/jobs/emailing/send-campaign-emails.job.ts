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

import "../../../organization/models/organization.model";
import "../../../user/models/invitation.model";
import "../../../user/models/userRight.model";
import "../../../place/models/place.model";

import delay from "delay";

import { parentPort } from "worker_threads";

import { logger } from "../../../general/logger";

import { sendCampaignEmails } from "../../../emailing/senders/send-campaign.email";

(async () => {
  try {
    logger.info("[EMAILS] Sending emails");
    await sendCampaignEmails();
    logger.info("[EMAILS] All emails sent");
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  await delay(1000);
  if (parentPort) parentPort.postMessage("done");
})();
