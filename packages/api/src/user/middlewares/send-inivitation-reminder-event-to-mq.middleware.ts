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
import { Themes } from "@soliguide/common";
import type { Logger } from "pino";
import { InvitationPopulate, UserPopulateType } from "src/_models";
import {
  AmqpInvitationEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "src/events";
import { getUserByParams } from "../services";
import { InvitationModel } from "../models/invitation.model";

// Function to check if the invitation is valid for 24 hours or 3 days
const isValidInvitation = (
  invitation: InvitationPopulate,
  hours: number
): boolean => {
  if (invitation.acceptedAt !== null) {
    return false;
  }

  const now = new Date();
  const sentAt = new Date(invitation.createdAt);

  const timeDifference =
    Math.abs(now.getTime() - sentAt.getTime()) / (1000 * 3600);

  return timeDifference === hours;
};
export const getInvitationsForReminder = async (
  hours: number
): Promise<InvitationPopulate[]> => {
  const invitations = await InvitationModel.find({
    acceptedAt: null,
    createdAt: { $lte: new Date() },
  });

  return invitations.filter((invitation) =>
    isValidInvitation(invitation, hours)
  );
};

export const sendInvitationReminderEventToMq = async (
  invitation: InvitationPopulate,
  hours: number,
  frontUrl: string,
  theme: Themes | null,
  routingKeySuffix: string,
  logger: Logger,
  userWhoInvited?: UserPopulateType
) => {
  if (!isValidInvitation(invitation, hours)) {
    return;
  }

  let user = userWhoInvited;
  if (!user && invitation.createdBy) {
    user = (await getUserByParams({ _id: invitation.createdBy })) ?? undefined;
  }

  const payload = new AmqpInvitationEvent(invitation, frontUrl, theme, user);

  await amqpEventsSender.sendToQueue<AmqpInvitationEvent>(
    Exchange.INVITATIONS,
    `${RoutingKey.INVITATIONS}.${routingKeySuffix}`,
    payload,
    logger
  );
};

export const send24hrReminderEventToMq = async (
  invitation: InvitationPopulate,
  frontUrl: string,
  theme: Themes | null,
  logger: Logger,
  userWhoInvited?: UserPopulateType
) => {
  await sendInvitationReminderEventToMq(
    invitation,
    24,
    frontUrl,
    theme,
    "reminder",
    logger,
    userWhoInvited
  );
};

export const send3DayReminderEventToMq = async (
  invitation: InvitationPopulate,
  frontUrl: string,
  theme: Themes | null,
  logger: Logger,
  userWhoInvited?: UserPopulateType
) => {
  await sendInvitationReminderEventToMq(
    invitation,
    72,
    frontUrl,
    theme,
    "reminder",
    logger,
    userWhoInvited
  );
};
