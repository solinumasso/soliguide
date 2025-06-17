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
import { PlaceStatus, PlaceVisibility, UserStatus } from "@soliguide/common";

import { TypesenseClient } from "../services/TypesenseClient.service";

import type { SearchRequest } from "../validators";
import { TypesensePlaceSearchQuery } from "../queries";
import { CurrentUserType } from "../../user/interfaces";

export const searchPlaces = async (
  request: SearchRequest,
  user: CurrentUserType
) => {
  const query = new TypesensePlaceSearchQuery({
    ...request,
    // fulltext search fields
    queryBy: ["name", "description"],
  });
  // Display only online places for non-admins
  if (
    !user.isLogged() ||
    (user.status !== UserStatus.ADMIN_TERRITORY &&
      user.status !== UserStatus.ADMIN_SOLIGUIDE &&
      user.status !== UserStatus.SOLI_BOT)
  ) {
    const filterByStatus = { status: PlaceStatus.ONLINE };
    if (query.filterBy) {
      query.filterBy = { ...query.filterBy, ...filterByStatus };
    } else {
      query.filterBy = filterByStatus;
    }
  }
  // Filter out places for everyone PROs for unauthorized users
  if (
    !user.isLogged() ||
    (user.status !== UserStatus.ADMIN_TERRITORY &&
      user.status !== UserStatus.ADMIN_SOLIGUIDE &&
      user.status !== UserStatus.SOLI_BOT &&
      user.status !== UserStatus.PRO)
  ) {
    const filterByVisibility = { visibility: PlaceVisibility.ALL };
    if (query.filterBy) {
      query.filterBy = { ...query.filterBy, ...filterByVisibility };
    } else {
      query.filterBy = filterByVisibility;
    }
  }
  return await TypesenseClient.instance.searchPlaces(query);
};
