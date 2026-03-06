import {
  ApiPlace,
  ServiceTranslatedFieldElement,
  SupportedLanguagesCode,
} from "@soliguide/common";

import dot from "dot-object";

import { PLACE_FIELDS_TO_TRANSLATE } from "../constants";
import { ApiTranslatedPlace } from "../interfaces";
import { logger } from "../../general/logger";

export const convertValue = (value?: string | number) => {
  if (
    value == null || // null or undefined
    !value.toString().trim().length
  ) {
    return null;
  }
  return value.toString().trim();
};

export const mergeTranslatedPlace = (
  place: ApiPlace,
  translatedPlace: ApiTranslatedPlace,
  lang: SupportedLanguagesCode
): ApiPlace => {
  const currentLanguagePlace = translatedPlace.languages[lang];

  if (!currentLanguagePlace) {
    logger.error(
      `No translation found for place ${place.lieu_id} and lang ${lang}`
    );
    return place;
  }
  const translatedPlaceContent = currentLanguagePlace.place;

  // Fields at in the place object root
  for (const field of PLACE_FIELDS_TO_TRANSLATE) {
    if (typeof dot.pick(field, place) !== "undefined") {
      const contentTranslated = convertValue(
        dot.pick(field, translatedPlaceContent)
      );
      const contentOrigin = convertValue(dot.pick(field, place));

      if (contentTranslated) {
        dot.copy(field, field, translatedPlaceContent, place);
      } else if (!contentOrigin) {
        dot.str(field, null, place);
      }
    }
  }

  if (place.services_all) {
    for (let i = 0; i < place.services_all.length; i++) {
      for (const field of Object.values<string>(
        ServiceTranslatedFieldElement
      )) {
        const serviceFieldName = field.replace("service.", "");

        if (dot.pick(serviceFieldName, place.services_all[i])) {
          const contentTranslated = convertValue(
            dot.pick(serviceFieldName, translatedPlaceContent.services_all[i])
          );

          const contentOrigin = convertValue(
            dot.pick(serviceFieldName, place.services_all[i])
          );

          if (contentTranslated) {
            dot.copy(
              serviceFieldName,
              serviceFieldName,
              translatedPlaceContent.services_all[i],
              place.services_all[i]
            );
          } else if (!contentOrigin) {
            dot.str(serviceFieldName, null, place.services_all[i]);
          }
        }
      }
    }
  }

  return place;
};
