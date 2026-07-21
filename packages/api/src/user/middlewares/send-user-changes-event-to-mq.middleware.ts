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
import { buildUserSynchroEvent } from "../services";

/**
 * Routing keys used to synchronise user changes to the external CRMs through
 * n8n. The same enriched payload is published to each: Airtable and Brevo bind
 * one queue per key on the `soliguide.users` topic exchange.
 */
const USER_SYNCHRO_ROUTING_KEYS = [
  `${RoutingKey.USERS}.synchro_at`,
  `${RoutingKey.USERS}.synchro_brevo`,
] as const;

export const sendUserChangesToMq = async (
  req: ExpressRequest & {
    isUserDeleted?: boolean;
    updatedUser?: UserPopulateType;
  }
) => {
  if (req.updatedUser) {
    const payload = await buildUserSynchroEvent(
      req.updatedUser,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme,
      { isDeleted: req.isUserDeleted }
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
