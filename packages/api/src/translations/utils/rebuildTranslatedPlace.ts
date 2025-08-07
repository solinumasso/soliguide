/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import dot from "dot-object";

import {
  ApiPlace,
  PlaceType,
  SupportedLanguagesCode,
  CommonPositionForTranslation,
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
} from "@soliguide/common";

import { ApiTranslatedField, ApiTranslatedPlace } from "../interfaces";
import { TranslatedPlaceModel } from "../models";
import { findTranslatedPlace } from "../services/translatedPlace.service";
import { logger } from "../../general/logger";

const defaultNumberOfHumanTranslations = (
  languages: SupportedLanguagesCode[]
): {
  [key in SupportedLanguagesCode]: number;
} => {
  const result = {} as { [key in SupportedLanguagesCode]: number };
  languages.forEach((lang) => {
    result[lang] = 0;
  });
  return result;
};

export const getPercent = (partial: number, total: number): number => {
  return total === 0 ? 0 : Math.floor((100 * partial) / total);
};

const setTranslationRate = (
  newPlace: ApiTranslatedPlace,
  numberOfHumanTranslations: {
    [key in SupportedLanguagesCode]: number;
  },
  numberOfElements: number
): void => {
  let totalTranslationRate = 0;

  const supportedLanguages =
    SUPPORTED_LANGUAGES_BY_COUNTRY[
      newPlace.position.country as SoliguideCountries
    ].otherLanguages;

  for (const lang of supportedLanguages) {
    const humanTranslation = numberOfHumanTranslations[lang];
    const percentTranslation = getPercent(humanTranslation, numberOfElements);
    const currentLanguage = newPlace.languages[lang];

    if (currentLanguage) {
      currentLanguage.translationRate = percentTranslation;
      totalTranslationRate += percentTranslation;
    }

    newPlace.translationRate = Math.floor(
      totalTranslationRate / supportedLanguages.length
    );
  }
};

/**
 * @summary Regenerate a place with all fields translated
 * @param  {Object} place
 * @param  {Array} translatedFields
 * @param  {Array} translatedServiceFields
 * @return  Object ApiTranslatedPlace
 */
export const rebuildTranslatedPlace = async (
  place: ApiPlace,
  translatedFields: ApiTranslatedField[],
  translatedServiceFields: ApiTranslatedField[]
): Promise<ApiTranslatedPlace> => {
  const placePosition =
    place.placeType === PlaceType.PLACE
      ? place.position
      : place.parcours[0].position;

  const oldPlace = await findTranslatedPlace({
    lieu_id: place.lieu_id,
  });

  let sourceLanguage = SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].source;

  if (oldPlace) {
    sourceLanguage = oldPlace.sourceLanguage;
  }

  const newPlace: ApiTranslatedPlace = new TranslatedPlaceModel({
    lastUpdate: new Date(),
    position: new CommonPositionForTranslation(placePosition),
    sourceLanguage,
  });

  const supportedLanguages =
    SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].otherLanguages;

  const numberOfHumanTranslations =
    defaultNumberOfHumanTranslations(supportedLanguages);

  const numberOfElements =
    translatedFields.length + translatedServiceFields.length;

  // Step 1: Translate elements at the place root

  // Browse elements to translate
  for (const translatedField of translatedFields) {
    // Browse languages
    for (const lang of supportedLanguages) {
      if (
        !translatedField.languages[lang]?.human ||
        !translatedField.languages[lang]?.auto
      ) {
        logger.error(
          `[REBUILD_TRANSLATED_PLACE]: No human elements for languages ${lang} for translatedField ${translatedField.elementName} of place ${place.lieu_id}`
        );
        continue;
      }
      // Get the automatic translation
      let content = translatedField.languages[lang].auto.content;
      // If there's a human translation, get it
      if (translatedField.languages[lang].human.content) {
        numberOfHumanTranslations[lang]++;
        content = translatedField.languages[lang].human.content;
      }

      dot.str(
        `languages.${lang}.place.${translatedField.elementName}`,
        content,
        newPlace
      );
    }
  }

  // Step 2: Services
  if (translatedServiceFields) {
    // 1. Map services by objectId
    const translatedServicesMap: { [key: string]: ApiTranslatedField[] } = {};
    for (const serviceTmp of translatedServiceFields) {
      if (serviceTmp.serviceObjectId) {
        const indexService = serviceTmp.serviceObjectId.toString();
        // Create the services array
        if (!translatedServicesMap[indexService]) {
          translatedServicesMap[indexService] = [];
        }

        // Add the service by serviceID
        translatedServicesMap[indexService].push(serviceTmp);
      }
    }

    for (const lang of supportedLanguages) {
      // New array of services which will end up in the translated place
      const newServices = [];

      for (const service of place.services_all) {
        const tmpService: Record<string, string> = {};

        const serviceObjectId = service.serviceObjectId;
        const translatedServiceFields = translatedServicesMap[serviceObjectId];

        if (translatedServiceFields) {
          for (const translatedServiceField of translatedServiceFields) {
            const servicePath = translatedServiceField.elementName.replace(
              "service.",
              ""
            );

            if (!translatedServiceField.languages[lang]) {
              throw new Error("TranslatedField not found");
            }

            // Get the automatic translation
            let content = translatedServiceField.languages[lang].auto.content;
            // If there's a human translation, we get it
            if (translatedServiceField.languages[lang].human.content) {
              numberOfHumanTranslations[lang]++;
              content = translatedServiceField.languages[lang].human.content;
            }
            tmpService[servicePath] = content;
          }
        }

        newServices.push(tmpService);
      }

      dot.str(`languages.${lang}.place.services_all`, newServices, newPlace);
    }
  }

  setTranslationRate(newPlace, numberOfHumanTranslations, numberOfElements);

  return newPlace;
};
