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
import {
  getInvitationsForReminder,
  send24hrReminderEventToMq,
  send3DayReminderEventToMq,
} from "src/user/middlewares/send-inivitation-reminder-event-to-mq.middleware";
import { Themes } from "@soliguide/common";
import { error } from "console";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://soliguide.fr/";
const THEME = process.env.THEME as Themes | null;

(async () => {
  console.log("[JOB START] Invitation reminder job is running...");

  try {
    logger.info("[REMINDERS] Sending 24-hour reminders");

    const invitations24hr = await getInvitationsForReminder(24);
    console.log(
      `[JOB INFO] Found ${invitations24hr.length} invitations for 24-hour reminder.`
    );

    for (const invitation of invitations24hr) {
      console.log(`[JOB INFO] Sending 24-hour reminder to ${invitation}`);
      await send24hrReminderEventToMq(invitation, FRONTEND_URL, THEME, logger);
    }
    logger.info("[REMINDERS] 24-hour reminders sent");

    logger.info("[REMINDERS] Sending 3-day reminders");

    const invitations3day = await getInvitationsForReminder(72);
    console.log(
      `[JOB INFO] Found ${invitations3day.length} invitations for 3-day reminder.`
    );

    for (const invitation of invitations3day) {
      console.log(`[JOB INFO] Sending 3-day reminder to ${invitation}`);
      await send3DayReminderEventToMq(invitation, FRONTEND_URL, THEME, logger);
    }
    logger.info("[REMINDERS] 3-day reminders sent");

    console.log(
      "[JOB SUCCESS] Invitation reminder job completed successfully."
    );
  } catch (e) {
    console.error("[JOB ERROR] An error occurred:", error);
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  await delay(1000);
  if (parentPort) parentPort.postMessage("done");
})();
