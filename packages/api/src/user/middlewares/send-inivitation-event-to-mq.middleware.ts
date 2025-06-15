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
import type { NextFunction } from "express";
import type { Logger } from "pino";

import type { Themes } from "@soliguide/common";

import { Exchange } from "../../events";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import {
  AmqpInvitationEvent,
  RoutingKey,
  amqpEventsSender,
} from "../../events";
import { getUserByParams } from "../services";
import { isCampaignActive } from "../../campaign/controllers";
import { InvitationPopulate, UserPopulateType } from "../interfaces";

const sendInvitationEventToMq = async (
  invitation: InvitationPopulate,
  frontUrl: string,
  theme: Themes | null,
  routingKeySuffix: string,
  logger: Logger,
  userWhoInvited?: UserPopulateType
) => {
  let user = userWhoInvited;
  // If we can let's search for the user who created the invitation
  if (!user && invitation.createdBy) {
    user = (await getUserByParams({ _id: invitation.createdBy })) ?? undefined;
  }
  const payload = new AmqpInvitationEvent(
    invitation,
    frontUrl,
    theme,
    user,
    isCampaignActive(invitation.user.territories)
  );

  await amqpEventsSender.sendToQueue<AmqpInvitationEvent>(
    Exchange.INVITATIONS,
    `${RoutingKey.INVITATIONS}.${routingKeySuffix}`,
    payload,
    logger
  );
};

export const sendAcceptedInvitationToMq = async (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  await sendInvitationEventToMq(
    req.invitation,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "accepted",
    req.log
  );
};

export const sendAcceptedInvitationToMqAndNext = async (
  req: ExpressRequest & { invitation: InvitationPopulate },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendAcceptedInvitationToMq(req);
  next();
};

export const sendNewInvitationToMqAndNext = async (
  req: ExpressRequest & { invitation: InvitationPopulate },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendInvitationEventToMq(
    req.invitation,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "new",
    req.log,
    req.user
  );
  next();
};

export const sendReNewInvitationToMqAndNext = async (
  req: ExpressRequest & { invitation: InvitationPopulate },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendInvitationEventToMq(
    req.invitation,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "renew",
    req.log
  );
  next();
};

export const sendDeteleInvitationToMq = async (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  await sendInvitationEventToMq(
    req.invitation,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "delete",
    req.log
  );
};

export const sendWelcomeToMqAndNext = async (
  req: ExpressRequest & { invitation: InvitationPopulate },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendInvitationEventToMq(
    req.invitation,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "welcome",
    req.log
  );
  next();
};
