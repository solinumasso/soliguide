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
  CountryAreaTerritories,
  OperationalAreas,
  SoliguideCountries,
} from "@soliguide/common";
import get from "lodash.get";

function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

function mergeCountryAreaTerritories<CountryCode extends SoliguideCountries>(
  area1: CountryAreaTerritories<CountryCode>,
  area2: CountryAreaTerritories<CountryCode>
): CountryAreaTerritories<CountryCode> {
  return new CountryAreaTerritories<CountryCode>({
    departments: mergeArrays(area1.departments ?? [], area2.departments ?? []),
    regions: mergeArrays(area1.regions ?? [], area2.regions ?? []),
    cities: mergeArrays(area1.cities ?? [], area2.cities ?? []),
  });
}

export const mergeOperationalAreas = (
  areasToImport?: OperationalAreas,
  areasToUpdate?: OperationalAreas
): OperationalAreas | undefined => {
  if (!areasToImport) {
    if (areasToUpdate) {
      return areasToUpdate;
    }
    return undefined;
  }

  if (!areasToUpdate) {
    areasToUpdate = areasToImport;
  }

  let mergedAreas: OperationalAreas = { ...areasToUpdate };

  for (const key of Object.keys(areasToImport)) {
    const country = key as SoliguideCountries;
    const areasExists = get(areasToUpdate, country);
    if (areasExists) {
      const mergedCountryArea = mergeCountryAreaTerritories(
        areasExists,
        areasToImport[country] as CountryAreaTerritories<SoliguideCountries>
      );

      mergedAreas = { ...mergedAreas, [country]: mergedCountryArea };
    } else {
      mergedAreas = { ...mergedAreas, [country]: areasToImport[country] };
    }
  }

  return mergedAreas;
};
