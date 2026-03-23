import { NextFunction } from "express";
import type {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";
import {
  Exchange,
  RoutingKey,
  amqpEventsSender,
  AmqpSynchroAirtableUserEvent,
} from "../../events";
import { getUserRightsWithParams } from "../services";

export const sendUserChangesToMq = async (
  req: ExpressRequest & {
    isUserDeleted?: boolean;
    updatedUser?: UserPopulateType;
  }
) => {
  if (req.updatedUser) {
    if (!req.updatedUser.userRights?.length) {
      req.updatedUser.userRights = await getUserRightsWithParams({
        user: req.updatedUser._id,
      });
    }

    const payload = new AmqpSynchroAirtableUserEvent(
      req.updatedUser,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme,
      req.isUserDeleted
    );

    await amqpEventsSender.sendToQueue<AmqpSynchroAirtableUserEvent>(
      Exchange.SYNCHRO_AT,
      `${RoutingKey.SYNCHRO_AT}.user`,
      payload,
      req.log
    );
  }
};

export const sendUserChangesToMqAndNext = (
  req: ExpressRequest & {
    isUserDeleted?: boolean;
    updatedUser?: UserPopulateType;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  sendUserChangesToMq(req).catch((e) =>
    req.log.error(e, "Failed to send user changes to MQ")
  );

  return next();
};
