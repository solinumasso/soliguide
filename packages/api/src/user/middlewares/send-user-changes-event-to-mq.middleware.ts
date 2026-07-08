import { NextFunction } from "express";
import { randomUUID } from "node:crypto";

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
import { UserModel } from "../models/user.model";

/**
 * Filet de sécurité pour le sync Brevo/Airtable : si un user atteint le sync
 * sans `campaignUserUuid` (source amont ayant oublié la projection, ou
 * document historique jamais atteint par la migration `20260708...`), on
 * génère + persiste un uuid avant d'émettre l'événement pour que Brevo reçoive
 * toujours la donnée. Update atomique et idempotent (`$exists: false`).
 */
const ensureCampaignUserUuid = async (
  user: UserPopulateType
): Promise<string> => {
  if (user.campaignUserUuid) {
    return user.campaignUserUuid;
  }

  const campaignUserUuid = randomUUID();
  await UserModel.updateOne(
    { _id: user._id, campaignUserUuid: { $exists: false } },
    { $set: { campaignUserUuid } }
  );
  user.campaignUserUuid = campaignUserUuid;
  return campaignUserUuid;
};

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

    await ensureCampaignUserUuid(req.updatedUser);

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
