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
import dot from "dot-object";
import { FilterQuery } from "mongoose";

import { PlaceChangesSection } from "@soliguide/common";

import { parseTerritories, parseTextSearch } from "../../search/utils";
import { PlaceChanges } from "../interfaces/PlaceChanges.interface";

import { UserForSearch } from "../../user/types";

export const createPlaceChangesSearchQuery = (
  searchData: any,
  user: UserForSearch
): FilterQuery<PlaceChanges> => {
  const query: FilterQuery<PlaceChanges> = {
    placeOnline: true,
    section: { $ne: PlaceChangesSection.CAMPAIGN_SOURCE_MAJ },
  };

  const searchFields = [
    "campaignName",
    "createdAt",
    "isCampaign",
    "lieu_id",
    "placeType",
    "section",
    "status",
    "territories",
    "updatedAt",
    "userData.email",
    "userData.orgaId",
    "userData.orgaName",
    "userData.status",
  ];

  // Remove null data
  searchData = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(searchData).filter(([_, v]) => !!v)
  );

  // We associate all non-empty data
  for (const field of searchFields) {
    const content = dot.pick(field, searchData);

    if (
      content != null // !null and !undefined
    ) {
      if (field === "userData.orgaId" || field === "userData.lieu_id") {
        query[field] = parseInt(content, 10);
      }

      // Name / Emails = checked with a regex
      else if (field === "userData.orgaName" || field === "userData.email") {
        parseTextSearch(query, searchData, field);
      }

      // Territories: we check the territories table
      else if (field === "territories") {
        const tempQuery = { territories: {} };
        parseTerritories(tempQuery, searchData, field, user);
        if (Object.keys(tempQuery.territories).length) {
          query["territory"] = tempQuery.territories;
          query["country"] = searchData.country;
        }
      }
      // Other fields: we check the exact content
      else {
        query[field] = content;
      }
    }
  }
  return query;
};
