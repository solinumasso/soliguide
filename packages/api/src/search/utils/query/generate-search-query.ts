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
import { RootQuerySelector } from "mongoose";
import { subMonths } from "date-fns";
import { set } from "dot-object";
import {
  CAMPAIGN_DEFAULT_NAME,
  AdminSearchFilterOrganization,
  CampaignStatusForSearch,
  PlaceSearchForAdmin,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  SearchFilterClosure,
  SearchPlaceStatus,
  UserStatus,
  Categories,
  ApiPlace,
  getAllowedTerritories,
  CountryCodes,
  CategoriesService,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { cleanSearchQuery } from "./clean-search-query";
import {
  parseCategories,
  parseLocation,
  parseLocationParcours,
  parseModalities,
  parseOpenToday,
  parsePublics,
  parseUpdatedAt,
} from "../parsers";
import { UserPopulateType } from "../../../_models";
import { buildEnhancedWordSearch } from "../parsers/parse-word";

export const generateSearchQuery = (
  categoryService: CategoriesService,
  searchData: Partial<PlaceSearchForAdmin>,
  user: UserPopulateType,
  admin = false
): RootQuerySelector<ApiPlace> => {
  const nosqlQuery: RootQuerySelector<ApiPlace> = {};

  if (searchData.placeType) {
    nosqlQuery.placeType = searchData.placeType;
  }

  const isUserAdmin =
    user.status === UserStatus.ADMIN_SOLIGUIDE ||
    user.status === UserStatus.ADMIN_TERRITORY;

  let inService = false;

  // Look into services if the requested category
  if (
    searchData.category ||
    searchData.categories ||
    (user.status === UserStatus.API_USER && user.categoriesLimitations?.length)
  ) {
    inService = true;
    nosqlQuery.services_all = { $elemMatch: {} };
  } else {
    nosqlQuery.$or = [{ services_all: { $elemMatch: {} } }, { $and: [] }];
  }

  // Widget can have multiple locations
  if (searchData.locations) {
    nosqlQuery.$and = [{ $or: [] }];

    for (const location of searchData.locations) {
      const tempNosqlQuery = {};

      // By default, for widget, we use France only
      set("location.areas.country", CountryCodes.FR, searchData);

      if (nosqlQuery.placeType === PlaceType.PLACE) {
        parseLocation(location, tempNosqlQuery, user, admin);
      } else if (nosqlQuery.placeType === PlaceType.ITINERARY) {
        parseLocationParcours(location, tempNosqlQuery, user, admin);
      }
      nosqlQuery.$and[0].$or!.push(tempNosqlQuery); // skipcq: JS-0339
    }
  }
  // Website, and API users search only one location by search
  else if (searchData.location) {
    if (searchData?.country) {
      set("location.areas.country", searchData?.country, searchData);
    }

    if (nosqlQuery.placeType === PlaceType.PLACE) {
      parseLocation(searchData.location, nosqlQuery, user, admin);
    } else if (nosqlQuery.placeType === PlaceType.ITINERARY) {
      parseLocationParcours(searchData.location, nosqlQuery, user, admin);
    }
  }

  if (searchData.modalities) {
    parseModalities(searchData.modalities, nosqlQuery, inService);
  }

  if (searchData.languages) {
    nosqlQuery.languages = { $in: [searchData.languages] };
  }

  if (searchData.publics) {
    parsePublics(searchData.publics, nosqlQuery, inService);
  }

  if (searchData?.word) {
    buildEnhancedWordSearch(searchData, nosqlQuery, SupportedLanguagesCode.FR);
  }

  if (searchData.openToday) {
    parseOpenToday(searchData.openToday, nosqlQuery, inService);
  }

  if (searchData.updatedByUserAt) {
    parseUpdatedAt(searchData.updatedByUserAt, nosqlQuery);
  }
  if (searchData.updatedAt) {
    parseUpdatedAt(searchData.updatedAt, nosqlQuery);
  }

  // If catToExclude does not exist, we add it to the searchData
  // NB: it may only exists in the admin if categories to exclude have been selected
  let catToExclude: Categories[] = [];
  if (admin) {
    catToExclude = searchData.catToExclude
      ? [...new Set(searchData.catToExclude)]
      : [];
  }

  let categoriesToSearch: Categories[] = [];

  if (searchData.category) {
    categoriesToSearch = [searchData.category];
  } else if (searchData.categories) {
    categoriesToSearch = searchData.categories;
  }

  parseCategories(
    categoryService,
    categoriesToSearch,
    nosqlQuery,
    user,
    admin,
    catToExclude,
    isUserAdmin
  );

  if (isUserAdmin) {
    if (searchData.status) {
      if (searchData.status === SearchPlaceStatus.ONE_MONTH_TO_OFFLINE) {
        nosqlQuery.updatedByUserAt = { $lte: subMonths(new Date(), 5) };
        nosqlQuery.status = PlaceStatus.ONLINE;
      } else {
        nosqlQuery.status = searchData.status;
      }
    }

    if (searchData.visibility) {
      nosqlQuery.visibility = searchData.visibility;
    }
    if (searchData.organization) {
      if (
        searchData.organization ===
        AdminSearchFilterOrganization.WITHOUT_ORGANIZATION
      ) {
        nosqlQuery.organizations = { $size: 0 };
      }
      if (
        searchData.organization ===
        AdminSearchFilterOrganization.WITH_ORGANIZATION
      ) {
        nosqlQuery.organizations = { $not: { $size: 0 } };
      }
    }

    if (searchData.close) {
      switch (searchData.close) {
        case SearchFilterClosure.ACTIVE:
          nosqlQuery["tempInfos.closure.dateDebut"] = {
            $exists: true,
            $ne: null,
          };
          break;
        case SearchFilterClosure.INACTIVE:
          nosqlQuery["tempInfos.closure.dateDebut"] = null;
          break;
        case SearchFilterClosure.OPEN_TODAY:
          nosqlQuery.isOpenToday = true;
          break;
        case SearchFilterClosure.CLOSED_TODAY:
          nosqlQuery.isOpenToday = false;
          break;
      }
    }
  } else {
    // The status in a normal search
    // By default we exclude drafts and only online places for non pro users
    nosqlQuery.status = PlaceStatus.ONLINE;
    if (user.status !== UserStatus.PRO) {
      nosqlQuery.visibility = PlaceVisibility.ALL;
    }
  }

  if (admin) {
    if (!searchData?.country) {
      throw new Error("COUNTRY_IS_REQUIRED_FOR_ADMIN_SEARCH");
    }
    const country = searchData?.country;

    const allowedTerritories = getAllowedTerritories(user, country);

    if (nosqlQuery.placeType === PlaceType.PLACE) {
      nosqlQuery["position.departmentCode"] = {
        $in: allowedTerritories,
      };
      nosqlQuery["position.country"] = country;
    } else if (nosqlQuery.placeType === PlaceType.ITINERARY) {
      nosqlQuery["parcours.position.departmentCode"] = {
        $in: allowedTerritories,
      };
      nosqlQuery["parcours.position.country"] = country;
    }

    if (typeof searchData.priority === "boolean") {
      nosqlQuery.priority = searchData.priority;
    }

    if (searchData.campaignStatus) {
      nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`] = true;
      if (searchData.campaignStatus === CampaignStatusForSearch.TO_DO) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.startDate`] =
          null;
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`] = null;
      } else if (
        searchData.campaignStatus === CampaignStatusForSearch.STARTED
      ) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] =
          false;
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.startDate`] = {
          $ne: null,
        };
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`] = null;
      } else if (
        searchData.campaignStatus === CampaignStatusForSearch.CHANGED
      ) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] = true;
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.changes`] = true;
      } else if (
        searchData.campaignStatus === CampaignStatusForSearch.NO_CHANGE
      ) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] = true;
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.changes`] =
          false;
      } else if (
        searchData.campaignStatus === CampaignStatusForSearch.FINISHED
      ) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] = true;
      } else if (searchData.campaignStatus === CampaignStatusForSearch.REMIND) {
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] =
          false;
        nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`] = {
          $ne: null,
        };
      }
    }

    if (searchData.autonomy?.length) {
      nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.autonomy`] = {
        $in: searchData.autonomy,
      };
    }

    if (searchData.sourceMaj?.length) {
      nosqlQuery[`campaigns.${CAMPAIGN_DEFAULT_NAME}.source`] = {
        $in: searchData.sourceMaj,
      };
    }

    if (typeof searchData.lieu_id === "number") {
      nosqlQuery.lieu_id = searchData.lieu_id;
    }
  }

  // 12. Cleaning the searchData from unnecessary conditions
  cleanSearchQuery(nosqlQuery);

  return nosqlQuery;
};
