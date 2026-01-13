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
import { UserStatus, CountryAreaTerritories, CommonUser } from "../../../users";
import { FR_DEPARTMENT_CODES } from "../../constants";
import { CountryCodes } from "../../enums";
import { getTerritoriesFromAreas } from "../getTerritoriesFromAreas";

const user = {
  status: UserStatus.ADMIN_SOLIGUIDE,
  areas: {
    fr: new CountryAreaTerritories<CountryCodes.FR>({
      departments: ["01", "03"],
    }),
  },
} as unknown as CommonUser;

describe("getTerritoriesFromAreas", () => {
  it("Return all departments for France, for ADMIN_SOLIGUIDE", () => {
    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual(
      FR_DEPARTMENT_CODES
    );
  });

  it("Return all departments for France, for ADMIN_TERRITORY", () => {
    user.status = UserStatus.ADMIN_TERRITORY;
    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual([
      "01",
      "03",
    ]);
  });

  it("Return empty territories array for another country", () => {
    user.status = UserStatus.PRO;
    user.areas = {
      es: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["25", "10", "03"],
      }),
    };

    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual([]);
  });

  it("Return territories array for spain", () => {
    user.status = UserStatus.PRO;
    user.areas = {
      es: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["25", "10", "03"],
      }),
    };

    expect(getTerritoriesFromAreas(user, CountryCodes.ES)).toEqual([
      "25",
      "10",
      "03",
    ]);
  });
});
