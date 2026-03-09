import type { NextFunction } from "express";
import type { Logger } from "pino";

import type { Themes } from "@soliguide/common";

import type {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";
import {
  Exchange,
  AmqpUserEvent,
  RoutingKey,
  amqpEventsSender,
} from "../../events";
import { isCampaignActive } from "../../campaign/controllers";

const sendUserEventToMq = async (
  user: UserPopulateType,
  frontUrl: string,
  theme: Themes | null,
  routingKeySuffix: string,
  logger: Logger
) => {
  const payload = new AmqpUserEvent(
    user,
    frontUrl,
    theme,
    isCampaignActive(user.territories)
  );

  await amqpEventsSender.sendToQueue<AmqpUserEvent>(
    Exchange.USERS,
    `${RoutingKey.USERS}.${routingKeySuffix}`,
    payload,
    logger
  );
};

export const sendResetPasswordToMqAndNext = async (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendUserEventToMq(
    req.selectedUser,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "reset-password",
    req.log
  );
  next();
};

export const sendResetedPasswordToMqAndNext = async (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendUserEventToMq(
    req.selectedUser,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "reseted-password",
    req.log
  );
  next();
};
