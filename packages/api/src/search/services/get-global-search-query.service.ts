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
import { FilterQuery } from "mongoose";

import { parseTerritories, parseTextSearch } from "../utils";
import { UserForSearch } from "../../user/types";

export function getGlobalSearchQuery<
  T extends { [key: string]: any },
  K extends Partial<keyof T>
>(searchData: T, searchFields: K[], user: UserForSearch): FilterQuery<T> {
  const query: { [k in keyof T]?: FilterQuery<T> } = {};

  const fields = searchFields.filter((field: K) => searchData[field] != null); // !null and !undefined

  // We associate all non-null values
  for (const field of fields) {
    // Name / Emails: we filter with a regex
    if (field === "name" || field === "mail" || field === "recipientEmail") {
      parseTextSearch(query, searchData, field);
    }

    // Territories: we check the territories table
    else if (field === "territories" || field === "territory") {
      parseTerritories(query, searchData, field, user);
    }

    // Other fields: we check the exact content
    else {
      query[field] = searchData[field];
    }
  }

  return query;
}
