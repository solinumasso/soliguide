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
import {
  getUserLastCampaignsChangesStatus,
  getUserRightsForCampaignStatus,
  getUserRightsWithParams,
  getUserToUpdateStatus,
} from "../services";

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

    const userRights = await getUserRightsForCampaignStatus(
      req.updatedUser._id
    );
    const toUpdate = getUserToUpdateStatus(userRights);
    const { midYear, endYear } = getUserLastCampaignsChangesStatus(userRights);

    const payload = new AmqpSynchroAirtableUserEvent(
      req.updatedUser,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme,
      req.isUserDeleted,
      toUpdate,
      midYear,
      endYear
    );

    await amqpEventsSender.sendToQueue<AmqpSynchroAirtableUserEvent>(
      Exchange.USERS,
      `${RoutingKey.USERS}.synchro_at`,
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
