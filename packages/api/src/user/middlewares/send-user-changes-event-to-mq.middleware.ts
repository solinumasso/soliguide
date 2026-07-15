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
 * Routing keys used to synchronise user changes to the external CRMs through
 * n8n. The same enriched payload is published to each: Airtable and Brevo bind
 * one queue per key on the `soliguide.users` topic exchange.
 */
const USER_SYNCHRO_ROUTING_KEYS = [
  `${RoutingKey.USERS}.synchro_at`,
  `${RoutingKey.USERS}.synchro_brevo`,
] as const;

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

    // Publish to each destination independently: a failure on one CRM must not
    // prevent the event from reaching the other.
    const publishResults = await Promise.allSettled(
      USER_SYNCHRO_ROUTING_KEYS.map((routingKey) =>
        amqpEventsSender.sendToQueue<AmqpSynchroAirtableUserEvent>(
          Exchange.USERS,
          routingKey,
          payload,
          req.log
        )
      )
    );

    publishResults.forEach((result, index) => {
      if (result.status === "rejected") {
        req.log.error(
          result.reason,
          `Failed to publish user event to ${USER_SYNCHRO_ROUTING_KEYS[index]}`
        );
      }
    });
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
