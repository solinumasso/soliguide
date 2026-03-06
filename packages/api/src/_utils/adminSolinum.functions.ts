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

import { User, UserPopulateType } from "../_models";

import get from "lodash.get";

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
