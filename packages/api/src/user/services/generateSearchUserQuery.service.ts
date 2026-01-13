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

import { UserStatus } from "@soliguide/common";

import { getGlobalSearchQuery } from "../../search/services";
import { parseTerritories } from "../../search/utils";
import { UserForSearch } from "../types";

export const generateSearchUserQuery = (
  searchUserData: {
    [k in
      | "name"
      | "mail"
      | "status"
      | "verified"
      | "territories"
      | "developer"]: any;
  },
  user: UserForSearch
) => {
  const query = getGlobalSearchQuery(
    searchUserData,
    ["name", "mail", "status", "verified"],
    user
  );

  parseTerritories(query, searchUserData, "territories", user, true, true);

  if (searchUserData.developer) {
    query.status = UserStatus.API_USER;
  }

  if (
    user.status !== UserStatus.ADMIN_SOLIGUIDE &&
    user.status !== UserStatus.SOLI_BOT
  ) {
    query.$and = [
      {
        status: {
          $nin: [UserStatus.SOLI_BOT, UserStatus.ADMIN_SOLIGUIDE],
        },
      },
    ];
  }
  return query;
};
