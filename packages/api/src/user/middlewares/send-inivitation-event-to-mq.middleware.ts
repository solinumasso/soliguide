import type { NextFunction } from "express";
import type { Logger } from "pino";

import type { Themes } from "@soliguide/common";

import type {
  ExpressRequest,
  ExpressResponse,
  InvitationPopulate,
  UserPopulateType,
} from "../../_models";
import {
  AmqpInvitationEvent,
  RoutingKey,
  amqpEventsSender,
  Exchange,
} from "../../events";
import { getUserByParams } from "../services";
import { isCampaignActive } from "../../campaign/controllers";

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
