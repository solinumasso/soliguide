import { AutoCompleteType, CountryCodes } from "@soliguide/common";

import { ExpressRequest } from "../../_models/express";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";
import { LogSearchPlaces } from "../../logging/interfaces";
import { findSuggestionBySynonym } from "../../search/utils/parsers/parse-word";

export const getSearchPropertiesFromRequest = (
  req: ExpressRequest
): LogSearchPlaces => {
  const { category, expression, word, languages } = req.bodyValidated;

  const searchType =
    category && expression
      ? "expression_and_category"
      : category
      ? "category"
      : "expression";

  let organization: string | null = null;
  let typeOfPlace: string | null = null;

  if (word) {
    const country = req.bodyValidated?.country ?? CountryCodes.FR;
    const foundSuggestion = findSuggestionBySynonym(word, languages, country);

    if (foundSuggestion?.type === AutoCompleteType.ORGANIZATION) {
      organization = word;
    } else if (foundSuggestion?.type === AutoCompleteType.ESTABLISHMENT_TYPE) {
      typeOfPlace = word;
    }
  }

  return {
    ...req.bodyValidated,
    user: { ...req.userForLogs! },
    search_type: searchType,
    nbResults: req.nbResults ?? 0,
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
