import { ExpressRequest } from "../../_models/express";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";

import { LogSearchPlaces } from "../../logging/interfaces";

export const getSearchPropertiesFromRequest = (
  req: ExpressRequest
): LogSearchPlaces => {
  const { category, expression } = req.bodyValidated;

  const searchType =
    category && expression
      ? "expression_and_category"
      : category
      ? "category"
      : "expression";

  return {
    ...req.bodyValidated,
    user: { ...req.userForLogs! },
    search_type: searchType,
    nbResults: req.nbResults ?? 0,
  };
};

export const trackSearchPlaces = (req: ExpressRequest) => {
  try {
    PosthogClient.instance.capture({
      event: TRACKED_EVENTS.API_SEARCH_PLACES,
      req,
      properties: getSearchPropertiesFromRequest(req),
    });
  } catch {
    req.log.error("LOG_API_SEARCH_PLACES_ERROR");
  }
};
