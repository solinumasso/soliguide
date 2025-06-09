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
import {
  ApiPlace,
  CountryCodes,
  getAllowedTerritories,
  SoliguideCountries,
} from "@soliguide/common";
import { UserForSearch } from "../../../user/types";

const createPositionRequestForCountry = (
  user: UserForSearch,
  country: SoliguideCountries
) => {
  const allowedTerritories = getAllowedTerritories(user, country);

  return {
    $or: [
      {
        "position.departmentCode": { $in: allowedTerritories },
        "position.country": country,
      },
      {
        "parcours.position.departmentCode": { $in: allowedTerritories },
        "parcours.position.country": country,
      },
    ],
  };
};

export const generateApiUserRestriction = (
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserForSearch
): RootQuerySelector<ApiPlace> => {
  const apiUserRestriction: RootQuerySelector<ApiPlace> = {};

  const userAreasCountries = Object.keys(user.areas ?? {});

  // One country only
  if (userAreasCountries.length === 1) {
    const country = userAreasCountries[0] as SoliguideCountries;
    const conditions = createPositionRequestForCountry(user, country);
    Object.assign(apiUserRestriction, conditions);
  }
  // Multiple countries
  else if (userAreasCountries.length > 1) {
    const countriesOr = userAreasCountries.map((country) =>
      createPositionRequestForCountry(user, country as SoliguideCountries)
    );
    apiUserRestriction.$or = countriesOr;
  }
  // Default: no country set, we use France
  else {
    const conditions = createPositionRequestForCountry(user, CountryCodes.FR);
    Object.assign(apiUserRestriction, conditions);
  }

  return { $and: [apiUserRestriction, nosqlQuery] };
};
