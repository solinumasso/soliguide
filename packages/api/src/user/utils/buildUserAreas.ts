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
  CountryAreaTerritories,
  DEPARTMENT_CODES,
  getTerritoriesFromAreas,
  SoliguideCountries,
  UserStatus,
} from "@soliguide/common";
import { User } from "src/_models";

export const buildUserAreas = (
  user: Pick<User, "status" | "areas"> & Partial<Pick<User, "territories">>,
  userData: { country: SoliguideCountries; territories?: AnyDepartmentCode[] }
) => {
  if (
    user.status === UserStatus.SOLI_BOT ||
    user.status === UserStatus.SIMPLE_USER // Translators doesn't have territories
  ) {
    return {
      areas: undefined,
      territories: [],
    };
  } else if (user.status === UserStatus.ADMIN_SOLIGUIDE) {
    return {
      areas: {
        ...user.areas,
        [userData.country]: new CountryAreaTerritories({
          departments: DEPARTMENT_CODES[userData.country],
        }),
      },
      territories: DEPARTMENT_CODES[userData.country],
    };
  } else if (user.status === UserStatus.PRO) {
    return {
      areas: user?.areas,
      territories: getTerritoriesFromAreas(user, userData.country),
    };
  } else {
    const territories = [
      ...new Set([
        ...(user.areas?.[userData.country]?.departments || []),
        ...(userData.territories || []),
      ]),
    ];

    return {
      areas: {
        ...user.areas,
        [userData.country]: new CountryAreaTerritories({
          departments: territories,
        }),
      },
      territories,
    };
  }
};
