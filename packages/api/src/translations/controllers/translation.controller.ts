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
import type { NextFunction } from "express";
import mongoose, { QueryOptions, type FilterQuery } from "mongoose";
import type { Logger } from "pino";

import {
  type ApiPlace,
  PlaceStatus,
  type SearchResults,
  ServiceTranslatedFieldElement,
  SupportedLanguagesCode,
  TempInfoType,
  type TranslatedField,
  TranslatedFieldElement,
  TranslatedFieldLanguageStatus,
  TranslatedFieldStatus,
  type TranslatedPlace,
  UserStatus,
  type CommonNewPlaceService,
  CommonPositionForTranslation,
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  getPosition,
} from "@soliguide/common";

import { ApiTranslatedFieldTranslatorData } from "../classes";
import { PLACE_FIELDS_TO_TRANSLATE } from "../constants";
import type { ApiTranslatedPlace, ApiTranslatedField } from "../interfaces";

import {
  countTranslatedFields,
  createFieldToTranslate,
  deleteTranslatedField,
  findParentElements,
  findServicesForPlace,
  findTranslatedField,
  findTranslatedFields,
  updateManyTranslatedFields,
} from "../services/translatedField.service";

import {
  countTranslatedPlaces,
  findTranslatedPlace,
  findTranslatedPlaces,
  patchTranslatedPlace,
} from "../services/translatedPlace.service";

import {
  mergeTranslatedPlace,
  rebuildTranslatedPlace,
  convertValue,
} from "../utils";

import type {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
} from "../../_models";

import { DEFAULT_SEARCH_OPTIONS } from "../../_utils/constants/DEFAULT_SEARCH_OPTIONS.const";
import { getPlaceByParams } from "../../place/services/place.service";
import { getGlobalSearchQuery } from "../../search/services/get-global-search-query.service";
import { generateSearchOptions } from "../../search/utils/query/generate-search-options";
import type { PopulatedTempInfo } from "../../temp-info/types";
import { getTranslatedFieldLanguagesByPlaceLanguages } from "../functions";
import { logger } from "../../general/logger";
import { TranslatedFieldModel, TranslatedPlaceModel } from "../models";
import { UserForSearch } from "../../user/types";
import { UserPopulate } from "../../user/interfaces";

/**
 * @param  {Object} searchData
 * @param  {Object} user user we's doing the search
 * @return {Promise} Elements to translate or translated
 */
export const searchTranslatedFields = async (
  searchData: any,
  user: UserForSearch
): Promise<SearchResults<TranslatedField>> => {
  const searchObject: {
    options: QueryOptions;
    query: FilterQuery<TranslatedField>;
  } = {
    options: {},
    query: {},
  };

  const isAdmin = user
    ? user.status === UserStatus.ADMIN_SOLIGUIDE ||
      user.status === UserStatus.ADMIN_TERRITORY
    : false;

  const statusParam =
    isAdmin && searchData.status
      ? {
          status: searchData.status,
        }
      : {
          status: {
            $nin: [
              TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
              TranslatedFieldStatus.DISABLED,
            ],
          },
        };

  searchObject.query = {
    "position.country": searchData?.country as SoliguideCountries,
    ...statusParam,
    ...getGlobalSearchQuery(searchData, ["lieu_id"], user),
  };

  const nbResults = await countTranslatedFields(searchObject.query);
  searchObject.options = generateSearchOptions(nbResults, searchData.options);

  const results = await findTranslatedFields(
    searchObject.query,
    searchObject.options
  );

  return {
    nbResults,
    results,
  };
};

/**
 * @param  {Object} searchData
 * @param  {Object} user user we's doing the search
 * @return {Promise} Elements to translate or translated
 */
export const searchTranslatedPlaces = async (
  searchData: any,
  user: UserForSearch
): Promise<SearchResults<TranslatedPlace>> => {
  // @Yassine The translation search serves no purpose except sorting translations?
  const searchObject: {
    options: QueryOptions;
    query: FilterQuery<TranslatedPlace>;
  } = {
    options: {},
    query: {},
  };

  searchObject.query = {
    ...getGlobalSearchQuery(searchData, ["lieu_id"], user),
    "position.country": searchData?.country as SoliguideCountries,
  };

  const nbResults = await countTranslatedPlaces(searchObject.query);

  searchObject.options = generateSearchOptions(nbResults, searchData.options);

  const results = await findTranslatedPlaces(
    searchObject.query,
    searchObject.options
  );

  return {
    nbResults,
    results,
  };
};

export const getTranslatedPlace = async (
  place: ApiPlace,
  lang: SupportedLanguagesCode
): Promise<ApiPlace> => {
  const translatedPlace = await findTranslatedPlace({
    lieu_id: place.lieu_id,
  });

  return translatedPlace
    ? mergeTranslatedPlace(place, translatedPlace, lang)
    : place;
};

/**
 * @param  {Array} places  places list
 * @param  {String}   lang    desired languages
 */
export const getTranslatedPlacesForSearch = async (
  places: ApiPlace[],
  lang: SupportedLanguagesCode
): Promise<ApiPlace[]> => {
  const placesIds = places
    .filter((place) => {
      if (place?.status !== PlaceStatus.ONLINE) {
        return false;
      }
      return SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].source !== lang;
    })
    .map((place: ApiPlace) => place._id);

  const options = structuredClone(DEFAULT_SEARCH_OPTIONS);
  const translatedPlaces = await findTranslatedPlaces(
    { placeObjectId: { $in: placesIds } },
    options
  );

  const translatedPlacesByPlaceId: Record<string, ApiTranslatedPlace> =
    translatedPlaces.reduce(
      (acc: Record<string, ApiTranslatedPlace>, place: ApiTranslatedPlace) => {
        acc[place.placeObjectId.toString()] = place;
        return acc;
      },
      {}
    );

  return places.reduce((acc: ApiPlace[], place: ApiPlace) => {
    if (
      place?._id?.toString() &&
      Object.hasOwn(translatedPlacesByPlaceId, place?._id?.toString() ?? "")
    ) {
      acc.push(
        mergeTranslatedPlace(
          place,
          translatedPlacesByPlaceId[place._id.toString()],
          lang
        )
      );
    } else {
      acc.push(place);
    }
    return acc;
  }, []);
};

const isTranslationCompleted = (translatedField: TranslatedField): boolean => {
  for (const language of Object.keys(translatedField.languages)) {
    if (!translatedField.languages[language as SupportedLanguagesCode]?.human) {
      logger.error(
        `[ISTRANSLATIONCOMPLETED]: No human elements for languages ${language} for element ${translatedField.elementName} of place ${translatedField.lieu_id}`
      );
      return false;
    }
    const humanTranslation =
      translatedField.languages[language as SupportedLanguagesCode]!.human;

    if (humanTranslation.content !== null && humanTranslation.content !== "") {
      return false;
    }
  }
  return true;
};

export const getPlaceAndRebuildTranslation = async (
  placeId: number
): Promise<void> => {
  const placeToTranslate = await findTranslatedPlace({
    lieu_id: placeId,
  });

  if (!placeToTranslate) {
    logger.error(
      `[TRANSLATION] Place translated not found, placeId : ${placeId}`
    );
    return;
  }

  const placeOrigin = await getPlaceByParams({
    lieu_id: placeToTranslate.lieu_id,
  });

  const parentElements = await findParentElements(placeToTranslate.lieu_id);

  const servicesElements = await findServicesForPlace({
    elementName: { $in: Object.values(ServiceTranslatedFieldElement) },
    lieu_id: placeToTranslate.lieu_id,
    serviceObjectId: { $ne: null },
  });

  if (placeOrigin && (parentElements || servicesElements)) {
    const newTranslatedPlace = await rebuildTranslatedPlace(
      placeOrigin,
      parentElements,
      servicesElements
    );

    await patchTranslatedPlace(placeToTranslate.lieu_id, {
      lastUpdate: newTranslatedPlace.lastUpdate,
      placeObjectId: newTranslatedPlace.placeObjectId,
      languages: newTranslatedPlace.languages,
    });
  } else {
    logger.warn(
      `[TRANSLATIONSUCTION]: No elements for place N*${placeToTranslate.lieu_id}`
    );
  }
};

const createTranslatedElement = async (
  place: ApiPlace,
  content: string,
  elementName: TranslatedFieldElement,
  serviceObjectId: null | mongoose.Types.ObjectId
): Promise<ApiTranslatedField> => {
  const potentialDuplicateTranslation = await findTranslatedFields(
    {
      content,
    },
    {}
  );

  const position = new CommonPositionForTranslation(getPosition(place));
  const sourceLanguage = SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].source;

  const newElement: Partial<ApiTranslatedField> = {
    content,
    position,
    elementName,
    sourceLanguage,
    lieu_id: place.lieu_id,
    placeObjectId: new mongoose.Types.ObjectId(place._id),
    serviceObjectId,
  };

  if (potentialDuplicateTranslation.length === 0) {
    const otherLanguages: SupportedLanguagesCode[] =
      SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].otherLanguages;

    return await createFieldToTranslate({
      ...newElement,
      languages: getTranslatedFieldLanguagesByPlaceLanguages(otherLanguages),
      sourceLanguage,
    });
  } else {
    // If there are potential duplicate translations, use the languages from the first one
    return await createFieldToTranslate({
      ...newElement,
      languages: potentialDuplicateTranslation[0].languages,
      sourceLanguage: potentialDuplicateTranslation[0].sourceLanguage,
    });
  }
};

/**
 * @summary Save a field
 * @param  {Object} place
 * @param  {string} content
 * @param  {TranslatedFieldElement} elementName
 */
const generateTranslatedField = async (
  place: ApiPlace,
  content: string,
  elementName: TranslatedFieldElement,
  fieldServiceId: null | string | mongoose.Types.ObjectId
): Promise<void> => {
  let serviceObjectId: null | mongoose.Types.ObjectId = null;

  serviceObjectId =
    typeof fieldServiceId === "string"
      ? new mongoose.Types.ObjectId(fieldServiceId)
      : fieldServiceId;

  // Does this element exists in teh database?
  const element = await findTranslatedField({
    elementName,
    lieu_id: place.lieu_id,
    serviceObjectId,
  });

  if (!element) {
    await createTranslatedElement(place, content, elementName, serviceObjectId);
  } else {
    // If the text hasn't change, we do nothing
    if (content === element.content) {
      return;
    }
    // Remove the old one
    await deleteTranslatedField({
      _id: element._id,
    });

    // Create the new one
    await createTranslatedElement(place, content, elementName, serviceObjectId);
  }
};

/**
 * @param  {Object} user Translator
 * @param  {Object} translatedField translation before patch
 * @param  {Object} translateData content + language coming from the update form
 */
export const patchTranslatedField = async (
  user: UserPopulate,
  translatedField: ApiTranslatedField,
  translateData: {
    content: string;
    lang: SupportedLanguagesCode;
  },
  logger: Logger
): Promise<void> => {
  const humanTranslate = new ApiTranslatedFieldTranslatorData({
    content: translateData.content,
    status: TranslatedFieldLanguageStatus.ONLINE,
    translator: user?._id ?? null,
    translatorName: user.name,
    updatedAt: new Date(),
  });

  const fieldPath = `languages.${translateData.lang}.human`;

  if (!translatedField?.languages[translateData.lang]?.human) {
    logger.error(
      `[PATCH_TRANSLATED_FIELD]: No human elements for languages ${translateData.lang} for element ${translatedField.elementName} of place ${translatedField.lieu_id}`
    );
    return;
  }

  translatedField.languages[translateData.lang]!.human = humanTranslate;

  const status = isTranslationCompleted(translatedField)
    ? TranslatedFieldStatus.TRANSLATION_COMPLETE
    : TranslatedFieldStatus.NEED_HUMAN_TRANSLATE;

  await updateManyTranslatedFields(
    { content: translatedField.content },
    {
      [fieldPath]: humanTranslate,
      status,
    }
  );

  await getPlaceAndRebuildTranslation(translatedField.lieu_id);
};

// Update elements to translate
const updateElement = async (
  place: ApiPlace,
  field: TranslatedFieldElement,
  serviceObjectId: null | mongoose.Types.ObjectId
): Promise<void> => {
  const objectToPick = serviceObjectId
    ? place.services_all.find(
        (s) => s.serviceObjectId.toString() === serviceObjectId.toString()
      )
    : place;

  const content = convertValue(dot.pick(field, objectToPick));

  const elementName = serviceObjectId
    ? (`service.${field}` as ServiceTranslatedFieldElement)
    : field;

  if (!content) {
    await deleteTranslatedField({
      elementName,
      lieu_id: place.lieu_id,
      ...(serviceObjectId && { serviceObjectId }),
    });
  } else {
    await generateTranslatedField(place, content, elementName, serviceObjectId);
  }
};

/**
 * @summary Generate elements to translate in the waiting list after a creation or an edition
 */
export const generateElementsToTranslate = async (
  req: ExpressRequest & {
    updatedPlace: ModelWithId<ApiPlace>;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  const place = req.updatedPlace;

  if (place.status === PlaceStatus.ONLINE) {
    try {
      // 1. generate fields for place
      for (const field of PLACE_FIELDS_TO_TRANSLATE) {
        await updateElement(place, field, null);
      }

      // 2. generate fields for place's services
      for (const serviceObjectId of place.services_all.map(
        (service: CommonNewPlaceService) => service.serviceObjectId
      )) {
        for (const field of Object.values(ServiceTranslatedFieldElement)) {
          const serviceFieldName = field.replace(
            "service.",
            ""
          ) as TranslatedFieldElement;
          await updateElement(place, serviceFieldName, serviceObjectId);
        }
      }

      await getPlaceAndRebuildTranslation(place.lieu_id);
    } catch (e) {
      req.log.error("GENERATE_FIELDS_TRANSLATE_FAIL", e);
    }
  }

  next();
};

export const deleteTempInfoTranslatedFields = async (
  tempInfo: PopulatedTempInfo,
  place: ModelWithId<ApiPlace>
): Promise<void> => {
  if (
    tempInfo.tempInfoType !== TempInfoType.SERVICE_CLOSURE &&
    tempInfo.description
  ) {
    const params: FilterQuery<ApiTranslatedField> = {
      lieu_id: place.lieu_id,
    };

    if (tempInfo.tempInfoType === TempInfoType.MESSAGE) {
      params.$or = [
        {
          content: tempInfo.description,
          elementName: "tempInfos.message.description",
        },
      ];

      if (tempInfo.name) {
        params.$or.push({
          content: tempInfo.name,
          elementName: "tempInfos.message.name",
        });
      }
    } else {
      params.content = tempInfo.description;
      params.elementName = `tempInfos.${tempInfo.tempInfoType}.description`;
    }

    await deleteTranslatedField(params);
    await getPlaceAndRebuildTranslation(place.lieu_id);
  }
};

export const patchPositionForTranslations = async (
  place: ModelWithId<ApiPlace>
) => {
  const position = getPosition(place);
  const positionForTranslation = new CommonPositionForTranslation(position);

  await TranslatedFieldModel.updateMany(
    { lieu_id: place.lieu_id },
    {
      $set: {
        position: positionForTranslation,
      },
    }
  );

  await TranslatedPlaceModel.updateOne(
    { lieu_id: place.lieu_id },
    {
      $set: {
        position: positionForTranslation,
      },
    }
  );
};
