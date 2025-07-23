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
import {
  CAMPAIGN_DEFAULT_NAME,
  PlaceStatus,
  type AnyDepartmentCode,
  UserRole,
  type ApiPlace,
  CountryCodes,
  CAMPAIGN_LIST,
} from "@soliguide/common";

import type {
  OrganizationPopulate,
  UserPopulateType,
  UserRight,
} from "../../_models";
import { PRIORITARY_CATEGORIES } from "../../categories/constants/prioritary-categories.const";

export const getPlaces = (
  user: UserPopulateType,
  organization: OrganizationPopulate,
  isAdmin: boolean
) => {
  const places = organization.places.filter((place) => {
    return (
      (place.status === PlaceStatus.ONLINE ||
        place.status === PlaceStatus.OFFLINE) &&
      place.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate &&
      place?.country !== CountryCodes.FR
    );
  });

  if (isAdmin) {
    return places;
  }

  const placesId = user.userRights
    .filter((right: UserRight) => right.role !== UserRole.READER)
    .map((right) => right.place_id);

  return places
    .filter((place: ApiPlace) => placesId.includes(place.lieu_id))
    .sort((place1: ApiPlace, place2: ApiPlace) => {
      let prioritary1 = 0;
      let prioritary2 = 0;

      for (const service of place1.services_all) {
        if (
          service.category &&
          PRIORITARY_CATEGORIES.includes(service.category)
        ) {
          prioritary1++;
        }
      }

      for (const service of place2.services_all) {
        if (
          service.category &&
          PRIORITARY_CATEGORIES.includes(service.category)
        ) {
          prioritary2++;
        }
      }

      return prioritary2 - prioritary1;
    });
};

export const isCampaignActive = (
  territories: AnyDepartmentCode[] = []
): boolean => {
  const now = new Date();

  let campaignIsOn = !territories.length;

  for (const territory of territories) {
    campaignIsOn =
      campaignIsOn ||
      CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories.includes(territory);

    if (campaignIsOn) {
      break;
    }
  }

  return (
    campaignIsOn &&
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutCampagne <= now &&
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateFin >= now
  );
};

export const isCampaignActiveForPlace = (place: ApiPlace): boolean => {
  return isCampaignActive() && place?.country === CountryCodes.FR;
};
