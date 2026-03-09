import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse, Origin } from "../../_models";

import { RequestInformation } from "./classes/request-information.class";

import { captureException } from "@sentry/node";
import { isPublicRoute } from "../../_utils/isPublicRoute";

export const handleRequest = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  req.requestInformation = new RequestInformation(req);

  // Skip origin check for public routes (bots, crawlers)
  if (isPublicRoute(req.path)) {
    return next();
  }

  if (
    !req.requestInformation?.originForLogs ||
    req.requestInformation.originForLogs === Origin.ORIGIN_UNDEFINED
  ) {
    const message = {
      CONTENT: Origin.ORIGIN_UNDEFINED,
      REQUEST_BODY: req.body,
      REQUEST_HEADERS: req.headers,
      STATUS: "API_CONNECTION_ATTEMPT",
    };
    captureException(new Error(JSON.stringify(message)));
    return res.status(403).send({ message: "FORBIDDEN_API_USER" });
  }

  next();
};
