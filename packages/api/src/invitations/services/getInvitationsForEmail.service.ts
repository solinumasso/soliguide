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
import { InvitationPopulate } from "src/_models";
import {
  AmqpInvitationEvent,
  RoutingKey,
  amqpEventsSender,
} from "../../events";
import { Exchange } from "../../events/enums";
import type { Logger } from "pino";
import { Themes } from "@soliguide/common";
import { InvitationModel } from "../../user/models/invitation.model";

import { subHours, subMinutes } from "date-fns";

export async function getInvitationsForReminder(hoursAgo: number) {
  const now = new Date();

  const targetTimeAgo = subHours(now, hoursAgo);
  const windowStart = subMinutes(targetTimeAgo, 1);
  const windowEnd = targetTimeAgo;

  return InvitationModel.find({
    status: "pending",
    createdAt: {
      $gte: windowStart,
      $lte: windowEnd,
    },
    acceptedAt: null,
  })
    .populate("organization")
    .exec();
}

export async function sendInvitationReminderEventToMq(
  invitation: InvitationPopulate,
  reminderType: "24hr" | "3day",
  logger: Logger
) {
  let theme: Themes | null = null;

  if (invitation.organization?.areas && invitation.organization.areas.fr) {
    theme = Themes.SOLIGUIDE_FR;
  }

  const event = new AmqpInvitationEvent(
    invitation,
    "https://soliguide.fr/",
    theme
  );

  try {
    const routingKey =
      reminderType === "24hr"
        ? `${RoutingKey.INVITATIONS}.Invitation24hReminder`
        : `${RoutingKey.INVITATIONS}.Invitation3DayReminder`;

    await amqpEventsSender.sendToQueue(
      Exchange.INVITATIONS,
      routingKey,
      event,
      logger
    );

    logger.info(
      `[REMINDER ${reminderType.toUpperCase()}] Sent reminder for invitation ${
        invitation.token
      }`
    );
  } catch (error) {
    logger.error(
      `[REMINDER ${reminderType.toUpperCase()}] Failed to send reminder for invitation ${
        invitation.token
      }`,
      error
    );
  }
}

export async function processInvitationReminders(logger: Logger) {
  try {
    logger.info("[REMINDERS] Sending 24-hour reminders");

    const invitations24hr = await getInvitationsForReminder(24);
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
    logger.error("[JOB ERROR] An error occurred:", e);
  }
}
