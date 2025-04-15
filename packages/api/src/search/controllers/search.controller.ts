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
  ApiSearchResults,
  UserStatus,
  CategoriesService,
} from "@soliguide/common";

import { generateSearchQuery, generateSearchOptions } from "../utils";

import { UserPopulateType } from "../../_models";

import {
  adminSearchPlacesWithParams,
  apiSearchPlacesWithParams,
  countPlacesWithLocationParams,
  searchPlacesWithParams,
} from "../services";

export const searchPlaces = async (
  categoryService: CategoriesService,
  user: UserPopulateType,
  searchPlacesData: any,
  context = "PLACE_PUBLIC_SEARCH"
): Promise<ApiSearchResults> => {
  const result: ApiSearchResults = {
    nbResults: 0,
    places: [],
  };

  const admin = [
    "EXPORT_PLACE",
    "MANAGE_PLACE",
    "ADD_PLACE_TO_ORGA",
    "MANAGE_PARCOURS",
  ].includes(context);

  const searchPlacesQuery = generateSearchQuery(
    categoryService,
    searchPlacesData,
    user,
    admin
  );

  result.nbResults = await countPlacesWithLocationParams(
    searchPlacesQuery,
    user
  );

  searchPlacesData.options = generateSearchOptions(
    result.nbResults,
    searchPlacesData.options,
    context
  );

  if (user.status === UserStatus.API_USER) {
    result.places = await apiSearchPlacesWithParams(
      searchPlacesQuery,
      user,
      searchPlacesData.options
    );
  } else {
    const serviceToCall = admin
      ? adminSearchPlacesWithParams
      : searchPlacesWithParams;

    result.places = (await serviceToCall(
      searchPlacesQuery,
      searchPlacesData.options
    )) as ApiPlace[];
  }

  return result;
};
