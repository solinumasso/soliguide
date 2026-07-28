import { NextFunction } from "express";

import type {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";
import { Exchange, RoutingKey, amqpEventsSender } from "../../events";
import { buildBrevoUserSynchroEvent, buildUserSynchroEvent } from "../services";

export const sendUserChangesToMq = async (
  req: ExpressRequest & {
    isUserDeleted?: boolean;
    updatedUser?: UserPopulateType;
  }
) => {
  if (!req.updatedUser) {
    return;
  }

  const { isUserDeleted: isDeleted } = req;

  // Build the shared base event once (consumed as-is by Airtable), then derive
  // the Brevo-specific variant enriched with placesCount. The base event is
  // never mutated, so the Airtable payload stays free of Brevo concerns.
  const baseEvent = await buildUserSynchroEvent(
    req.updatedUser,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    { isDeleted }
  );
  const brevoEvent = await buildBrevoUserSynchroEvent(baseEvent, { isDeleted });

  // Publish to each destination independently: a failure on one CRM must not
  // prevent the event from reaching the other.
  const publications = [
    { routingKey: `${RoutingKey.USERS}.synchro_at`, payload: baseEvent },
    { routingKey: `${RoutingKey.USERS}.synchro_brevo`, payload: brevoEvent },
  ];

  const publishResults = await Promise.allSettled(
    publications.map(({ routingKey, payload }) =>
      amqpEventsSender.sendToQueue(Exchange.USERS, routingKey, payload, req.log)
    )
  );

  publishResults.forEach((result, index) => {
    if (result.status === "rejected") {
      req.log.error(
        result.reason,
        `Failed to publish user event to ${publications[index].routingKey}`
      );
    }
  });
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
