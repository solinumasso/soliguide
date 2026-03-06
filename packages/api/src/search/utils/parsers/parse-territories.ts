import { FilterQuery } from "mongoose";

import {
  AnyDepartmentCode,
  SoliguideCountries,
  UserStatus,
  getAllowedTerritories,
} from "@soliguide/common";
import { User } from "../../../_models";

//
// Description: parse territories as simple array of department code
// This function is used for translations & placeChanges
//

export const parseTerritories = <T extends { [key: string]: any }>(
  query: FilterQuery<any>,
  searchData: T,
  field: keyof T,
  user: User,
  searchInAreas: boolean = false,
  nullableTerritories = false
) => {
  // Check if the user has the required permissions and if searchData contains a country
  if (
    ![UserStatus.ADMIN_TERRITORY, UserStatus.ADMIN_SOLIGUIDE].includes(
      user.status
    ) ||
    !searchData?.country
  ) {
    return;
  }

  const country: SoliguideCountries = searchData?.country;
  let territoriesField = `areas.${country}.departments`;
  let allowedTerritories = getAllowedTerritories(user, country);

  if (!searchInAreas) {
    // For Organizations & users, we are lookin for `areas.${country}.departments`
    // For other searches, it's only 'territories' or 'territory'
    territoriesField = field as string;
    query.country = country;
  }

  if (searchData[field]?.length && allowedTerritories?.length) {
    const searchTerritories = searchData[field];
    allowedTerritories = searchTerritories.filter((value: AnyDepartmentCode) =>
      allowedTerritories.includes(value)
    );
  } else {
    allowedTerritories = [];
  }

  if (nullableTerritories) {
    query.$or = [
      { areas: null },
      { [territoriesField]: { $in: allowedTerritories } },
    ];
  } else {
    query[territoriesField] = { $in: allowedTerritories };
  }
};
