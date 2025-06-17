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
  ApiPlace,
  AnyDepartmentCode,
  PlaceType,
  UserRightStatus,
  UserStatus,
  SoliguideCountries,
  PlaceStatus,
  CountryCodes,
  OperationalAreas,
  getAllowedTerritories,
} from "@soliguide/common";

import get from "lodash.get";
import { User, UserPopulateType } from "../user/interfaces";

// Check whether the user is a territory admin or a Soliguide admin
export const hasAdminAccessToOrga = (
  authUser: Pick<UserPopulateType, "status" | "territories" | "areas">,
  organizationOrUser: {
    status?: UserStatus | UserRightStatus;
    user?: User;
    territories?: AnyDepartmentCode[];
    areas?: OperationalAreas;
  }
): boolean => {
  // Admin soliguide = root
  if (
    authUser.status === UserStatus.ADMIN_SOLIGUIDE ||
    authUser.status === UserStatus.SOLI_BOT
  ) {
    return true;
  }

  if (
    organizationOrUser?.status === UserStatus.ADMIN_SOLIGUIDE ||
    organizationOrUser?.user?.status === UserStatus.ADMIN_SOLIGUIDE
  ) {
    return false;
  }

  // Territory admin: verification of the belonging to the territory
  if (authUser.status === UserStatus.ADMIN_TERRITORY && authUser?.areas) {
    if (!organizationOrUser?.areas) {
      return false;
    }

    for (const countryCode in organizationOrUser.areas) {
      const authUserDepartments: AnyDepartmentCode[] =
        get(authUser, `areas.${countryCode}.departments`, []) ?? [];
      const organizationOrUserDepartments: AnyDepartmentCode[] =
        get(organizationOrUser, `areas.${countryCode}.departments`, []) ?? [];

      const isTerritoryFound = organizationOrUserDepartments.some((dept) =>
        authUserDepartments.includes(dept)
      );

      if (isTerritoryFound) {
        return true;
      }
    }
  }
  return false;
};

// Check whether the user is a territory admin or a Soliguide admin
export const hasAdminAccessToPlace = (
  authUser: Pick<User, "status" | "territories" | "areas">,
  place: ApiPlace
): boolean => {
  // Admin soliguide = root
  if (
    authUser.status === UserStatus.ADMIN_SOLIGUIDE ||
    authUser.status === UserStatus.SOLI_BOT
  ) {
    return true;
  }

  // Territory admin: verification of the belonging to the territory
  if (authUser.status === UserStatus.ADMIN_TERRITORY) {
    const position = place?.parcours?.length
      ? place?.parcours[0].position
      : place?.position;

    const country = position?.country ?? null;

    // This place is not yet associated to a country
    if (
      (place?.status === PlaceStatus.DRAFT && !place.stepsDone.emplacement) ||
      !country
    ) {
      return true;
    }

    return adminTerritoryCanAccessToTerritory(authUser, place, country);
  }

  return false;
};

export const adminTerritoryCanAccessToTerritory = (
  authUser: Pick<User, "status" | "territories" | "areas">,
  place: ApiPlace,
  country: CountryCodes
) => {
  const userTerritories = getAllowedTerritories(
    authUser,
    country as SoliguideCountries
  );

  if (!userTerritories?.length) {
    return false;
  }

  // Check the territory
  return userTerritories.some((territory) =>
    isPlaceOnTerritory(territory, place)
  );
};

export const isPlaceOnTerritory = (
  referenceTerritory: string,
  place: ApiPlace
): boolean => {
  switch (place.placeType) {
    case PlaceType.PLACE:
      return referenceTerritory === place.position?.departmentCode;
    case PlaceType.ITINERARY:
      return place.parcours.reduce((isOnTerritory, point) => {
        if (
          !isOnTerritory &&
          referenceTerritory === point.position?.departmentCode
        ) {
          isOnTerritory = true;
        }

        return isOnTerritory;
      }, false);
    default:
      return true;
  }
};
