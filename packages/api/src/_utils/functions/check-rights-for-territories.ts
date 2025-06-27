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
  AnyDepartmentCode,
  SoliguideCountries,
  CountryCodes,
  DEPARTMENTS_MAP,
  UserStatus,
  getAllowedTerritories,
} from "@soliguide/common";
import { ExpressRequest } from "../../_models";
import { UserPopulateType } from "../../user/interfaces";

export const checkRightsForTerritories = (
  territories: AnyDepartmentCode[],
  req: ExpressRequest
): boolean => {
  // 1. Check if country is available
  validateCountry(req.body?.country);

  // 2. Check if territories exist
  validateTerritories(req.body?.country, territories);

  // Admins can access to all territories
  const user: UserPopulateType = req.user;
  if (user.status === UserStatus.ADMIN_SOLIGUIDE) {
    return true;
  }

  return checkUserTerritoryRights(user, territories, req.body?.country);
};

export function validateCountry(country: SoliguideCountries): void {
  if (![CountryCodes.FR, CountryCodes.ES, CountryCodes.AD].includes(country)) {
    throw new Error("COUNTRY_IS_NOT_ALLOWED");
  }
}

export function validateTerritories(
  country: SoliguideCountries,
  territories: AnyDepartmentCode[]
): void {
  const availableTerritories = Object.keys(DEPARTMENTS_MAP[country]);

  territories.forEach((territory) => {
    if (!availableTerritories.includes(territory)) {
      throw new Error(
        `Territory "${territory}" doesn't exist for country ${country}`
      );
    }
  });
}

export function checkUserTerritoryRights(
  user: UserPopulateType,
  territories: AnyDepartmentCode[],
  country: SoliguideCountries
): boolean {
  const userTerritories = getAllowedTerritories(user, country);

  if (!userTerritories?.length) {
    throw new Error(
      `You do not have the rights necessary to seek on this country`
    );
  }

  territories.forEach((territory) => {
    if (!userTerritories.includes(territory)) {
      throw new Error(
        `You do not have the rights necessary to seek on this territory: "${territory}" (country: ${country})`
      );
    }
  });

  return true;
}
