/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
  convertNewToOldMobilityCategory,
  isNewMobilityCategory,
  LegacyMobilityCategory,
} from "@soliguide/common";

export const convertPlaceFromNewMobilityToOld = (
  places: ApiPlace[]
): ApiPlace[] => {
  return places.map((place: ApiPlace) => {
    if (!place.services_all?.length) return place;

    return {
      ...place,
      services_all: place.services_all.map((service) => {
        if (!service.category) return service;

        // Only convert if it's a new mobility category
        if (!isNewMobilityCategory(service.category)) return service;

        const legacyCategory = convertNewToOldMobilityCategory(
          service.category
        );

        // If conversion found, return service with legacy category
        if (legacyCategory) {
          return {
            ...service,
            category: legacyCategory as LegacyMobilityCategory,
          };
        }

        return service;
      }),
    };
  }) as ApiPlace[];
};
