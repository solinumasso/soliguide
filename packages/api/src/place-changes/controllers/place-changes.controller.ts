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
import type { NextFunction } from "express";
import { isDeepStrictEqual } from "util";

import {
  CAMPAIGN_DEFAULT_NAME,
  CommonPlaceChanges,
  getTerritoryAndCountryFromPlace,
  PlaceChangesSection,
  PlaceChangesStatus,
  SearchResults,
  type ApiPlace,
  type CampaignChangesSection,
  UserStatus,
} from "@soliguide/common";

import type {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
  UserForLogs,
  UserPopulateType,
} from "../../_models";
import { generateSearchOptions } from "../../search/utils";
import { BOT_USER_FOR_LOGS } from "../../user/constants";
import { createPlaceChangesSearchQuery } from "../services/create-place-changes-search-query.service";
import {
  countPlaceChanges,
  findPlaceChanges,
  savePlaceChanges,
  updatePlaceChangeWithParams,
  updatePlaceChangesWithParams,
} from "../services/place-changes.service";
import { getNoChanges, getSectionData } from "../utils/place-changes-utils";
import { getMongoId } from "../../_utils/functions/mongo";
import type { PlaceChanges } from "../interfaces/PlaceChanges.interface";
import { updatePlaceUpdatedAtByPlaceId } from "../../place/services/admin-place.service";

/**
 * @param  {Object} searchData
 * @param  {Object} user user initiating the search
 * @param light
 * @return {Promise} Number of changes and list of changes
 */
export const searchPlaceChanges = async (
  searchData: any,
  user: UserPopulateType,
  light?: boolean
): Promise<SearchResults<CommonPlaceChanges>> => {
  const searchObject = { options: {}, query: {} };

  searchObject.query = createPlaceChangesSearchQuery(searchData, user);

  const nbResults = await countPlaceChanges(searchObject.query);

  searchObject.options = generateSearchOptions(nbResults, searchData.options);

  const results = await findPlaceChanges(
    searchObject.query,
    searchObject.options,
    light
  );

  return {
    nbResults,
    results,
  };
};

export const patchPlaceChange = async (_id: string, data: any) => {
  return await updatePlaceChangeWithParams({ _id }, data);
};

export const setObsoletePlaceChanges = async (
  req: Omit<ExpressRequest, "placeDeleted"> & {
    placeDeleted: ModelWithId<ApiPlace>;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  const place = req.placeDeleted;

  try {
    await updatePlaceChangesWithParams(
      { lieu_id: place.lieu_id },
      { placeOnline: false }
    );

    next();
  } catch (e) {
    req.log.error(e, "SET_OBSOLETE_PLACE_CHANGES_FAILED");
  }
};

export const savePatchChanges = async (
  section: PlaceChangesSection,
  oldPlace: ApiPlace | null,
  updatedPlace: ApiPlace,
  userForLogs: UserForLogs,
  forceChanges: boolean,
  isCampaign = false
): Promise<PlaceChanges | null> => {
  const lieu_id = updatedPlace.lieu_id;
  const placeObjectId = getMongoId(updatedPlace._id);
  const userData = userForLogs;

  const { newSectionData, oldSectionData } = getSectionData(
    section,
    oldPlace,
    updatedPlace
  );

  const hasChanges = !isDeepStrictEqual(newSectionData, oldSectionData);

  if (hasChanges && !forceChanges) {
    updatePlaceUpdatedAtByPlaceId(lieu_id);
  }

  if (hasChanges || forceChanges) {
    const status =
      userData.status === UserStatus.ADMIN_SOLIGUIDE ||
      userData.status === UserStatus.ADMIN_TERRITORY ||
      userData.status === UserStatus.SOLI_BOT ||
      !hasChanges
        ? PlaceChangesStatus.VALID
        : PlaceChangesStatus.NOT_EVALUATED;

    const { territory, country } =
      getTerritoryAndCountryFromPlace(updatedPlace);

    return await savePlaceChanges({
      isCampaign,
      lieu_id,
      new: newSectionData,
      noChanges: !hasChanges,
      old: oldSectionData,
      place: placeObjectId,
      placeType: updatedPlace.placeType,
      section,
      status,
      country,
      territory,
      userData,
    });
  }
  return Promise.resolve(null);
};

export const saveTempChanges = async (
  section: PlaceChangesSection | CampaignChangesSection,
  oldPlace: ApiPlace | null,
  updatedPlace: ApiPlace,
  userForLogs: UserForLogs,
  noChanges = false, // By default we consider that it's a change
  isCampaign = false,
  automation = false // True if coming from Solibot
): Promise<PlaceChanges> => {
  const lieu_id = updatedPlace.lieu_id;
  const placeObjectId = getMongoId(updatedPlace._id);

  // Who did the update?
  const userData = !automation ? userForLogs : BOT_USER_FOR_LOGS;

  // If it's a campaign, we save it's name
  const campaignName = isCampaign ? CAMPAIGN_DEFAULT_NAME : null;

  const { newSectionData, oldSectionData } = !noChanges
    ? getSectionData(section, oldPlace, updatedPlace)
    : { newSectionData: null, oldSectionData: null };

  const status =
    userData.status === UserStatus.ADMIN_SOLIGUIDE ||
    userData.status === UserStatus.ADMIN_TERRITORY ||
    userData.status === UserStatus.SOLI_BOT ||
    noChanges
      ? PlaceChangesStatus.VALID
      : PlaceChangesStatus.NOT_EVALUATED;

  const { territory, country } = getTerritoryAndCountryFromPlace(updatedPlace);

  return await savePlaceChanges({
    automation,
    campaignName,
    isCampaign,
    lieu_id,
    new: newSectionData,
    noChanges: getNoChanges(noChanges, section, newSectionData, oldSectionData),
    old: oldSectionData,
    place: placeObjectId,
    placeType: updatedPlace.placeType,
    section,
    status,
    country,
    territory,
    userData,
  });
};
