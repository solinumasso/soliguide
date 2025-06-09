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
import { FilterQuery } from "mongoose";

import {
  AnyDepartmentCode,
  SoliguideCountries,
  UserStatus,
  getAllowedTerritories,
} from "@soliguide/common";

import { isUserStatusInArray } from "../../../user/utils";
import { UserForSearch } from "../../../user/types";

//
// Description: parse territories as simple array of department code
// This function is used for translations & placeChanges
//

export const parseTerritories = <T extends { [key: string]: any }>(
  query: FilterQuery<any>,
  searchData: T,
  field: keyof T,
  user: UserForSearch,
  searchInAreas: boolean = false,
  nullableTerritories = false
) => {
  // Check if the user has the required permissions and if searchData contains a country
  if (
    !isUserStatusInArray(user.status, [
      UserStatus.ADMIN_TERRITORY,
      UserStatus.ADMIN_SOLIGUIDE,
    ]) ||
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
