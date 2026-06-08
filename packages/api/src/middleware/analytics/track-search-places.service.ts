import { ExpressRequest } from "../../_models/express";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";
import { LogSearchPlaces } from "../../logging/interfaces";

export const getSearchPropertiesFromRequest = (
  req: ExpressRequest
): LogSearchPlaces => {
  const { category, expression, trackingData, ...bodyWithoutTrackingData } =
    req.bodyValidated;

  const searchType =
    category && expression
      ? "expression_and_category"
      : category
      ? "category"
      : "expression";

  const organization = trackingData?.organization ?? null;
  const typeOfPlace = trackingData?.typeOfPlace ?? null;
  const isStructuredSearch = organization !== null || typeOfPlace !== null;

  return {
    ...bodyWithoutTrackingData,
    category,
    expression,
    user: { ...req.userForLogs! },
    search_type: searchType,
    nbResults: req.nbResults ?? 0,
    word: isStructuredSearch ? null : bodyWithoutTrackingData.word ?? null,
    organization,
    typeOfPlace,
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
