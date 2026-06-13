import { AutoCompleteType } from "@soliguide/common";

import { ExpressRequest } from "../../_models/express";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";
import { LogSearchPlaces } from "../../logging/interfaces";

export const getSearchPropertiesFromRequest = (
  req: ExpressRequest
): LogSearchPlaces => {
  const { category, searchType, ...bodyRest } = req.bodyValidated;

  const isStructuredSearch =
    searchType === AutoCompleteType.ORGANIZATION ||
    searchType === AutoCompleteType.ESTABLISHMENT_TYPE;

  return {
    ...bodyRest,
    category,
    user: { ...req.userForLogs! },
    nbResults: req.nbResults ?? 0,
    word: isStructuredSearch ? null : bodyRest.word ?? null,
    searchType: searchType ?? null,
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
