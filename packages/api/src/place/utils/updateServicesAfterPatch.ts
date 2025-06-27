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
import { ApiPlace } from "@soliguide/common";
import { isServiceOpenToday } from "./isOpenToday";

export const updateServicesAfterPatch = async (place: ApiPlace) => {
  if (place.services_all?.length) {
    place.services_all = await Promise.all(
      place.services_all.map(async (service) => {
        // 1. Opening hours copy
        if (!service.differentHours) {
          service.hours = place.newhours;
        }

        // 2. Welcomed publics copy
        if (!service.differentPublics) {
          service.publics = place.publics;
        }

        // 3. Access conditions copy
        if (!service.differentModalities) {
          service.modalities = place.modalities;
          service.modalities.docs = [];
        }

        // 4. 'isOpenToday' update
        service.isOpenToday = await isServiceOpenToday(service, place);

        return service;
      })
    );
  }
  return place.services_all;
};
