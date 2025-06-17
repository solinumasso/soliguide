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
import delay from "delay";
import { logger } from "src/general/logger";
import { parentPort } from "worker_threads";
import {
  sendInvitationReminderEventToMq,
  getInvitationsForReminder,
} from "../../../invitations/services/getInvitationsForEmail.service";

(async () => {
  try {
    logger.info("[REMINDERS] Sending 24-hour reminders");

    const invitations24hr = await getInvitationsForReminder(24);
    logger.info("[INVITATIONS 24HR] Retrieved invitations:", invitations24hr);

    for (const invitation of invitations24hr) {
      await sendInvitationReminderEventToMq(invitation, "24hr", logger);
    }

    logger.info("[REMINDERS] Sending 3-day reminders");

    const invitations3day = await getInvitationsForReminder(72);
    for (const invitation of invitations3day) {
      await sendInvitationReminderEventToMq(invitation, "3day", logger);
    }

    logger.info(
      "[JOB SUCCESS] Invitation reminder job completed successfully."
    );
  } catch (e) {
    logger.error("[JOB ERROR] An error occurred:", e.message, e.stack);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  await delay(1000);
  if (parentPort) parentPort.postMessage("done");
})();
