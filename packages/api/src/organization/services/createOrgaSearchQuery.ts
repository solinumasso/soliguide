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
import { CAMPAIGN_DEFAULT_NAME } from "@soliguide/common";

import { getPlaceByParams } from "../../place/services/place.service";
import { getGlobalSearchQuery } from "../../search/services";
import { parseTerritories } from "../../search/utils";
import { UserForSearch } from "../../user/types";

export const createOrgaSearchQuery = async (
  searchData: any,
  user: UserForSearch
) => {
  const query: any = {
    $and: [],
    ...getGlobalSearchQuery(searchData, ["name"], user),
  };

  if (searchData?.territories) {
    parseTerritories(query, searchData, "territories", user, true);
  }

  if (typeof searchData.lieu_id === "number") {
    const place = await getPlaceByParams({
      lieu_id: parseInt(searchData.lieu_id, 10),
    });

    if (place?._id) {
      query["$and"].push({ places: { $in: [place._id] } });
    }
  }

  if (typeof searchData.organization_id === "number") {
    query["$and"].push({ organization_id: searchData.organization_id });
  }

  if (searchData.name) {
    query["$and"].push({
      name: {
        $options: "i",
        $regex: new RegExp(`.*${searchData.name}.*`),
      },
    });
  }

  if (typeof searchData.priority === "boolean") {
    query["$and"].push({ priority: searchData.priority });
  }

  // Old campaign format
  if (searchData.campaignStatus) {
    query["$and"].push({
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.status`]: searchData.campaignStatus,
    });
  }

  // TODO remove parts with NONE once the relations are completed
  if (searchData.relations) {
    if (searchData.relations.length === 0) {
      query["$and"].push({ relations: { $size: 0 } });
    } else {
      if (searchData.relations.includes("NO_RELATION")) {
        const tempQuery: { $or: any[] } = { $or: [] };

        searchData.relations.splice(
          searchData.relations.indexOf("NO_RELATION"),
          1
        );

        tempQuery["$or"].push({ relations: { $size: 0 } });
        tempQuery["$or"].push({ relations: { $in: searchData.relations } });
        query["$and"].push(tempQuery);
      } else {
        query["$and"].push({ relations: { $in: searchData.relations } });
      }
    }
  }

  if (searchData.userTypes?.length) {
    const tempQuery: { $or: any[] } = { $or: [] };

    if (searchData.userTypes.includes("USERS")) {
      tempQuery["$or"].push({ "counters.users.TOTAL": { $gte: 1 } });
    }
    if (searchData.userTypes.includes("NO_USERS")) {
      tempQuery["$or"].push({ "counters.users.TOTAL": 0 });
    }
    if (searchData.userTypes.includes("INVITATIONS")) {
      tempQuery["$or"].push({ "counters.invitations.TOTAL": { $gte: 1 } });
    }
    if (searchData.userTypes.includes("NO_INVITATIONS")) {
      tempQuery["$or"].push({ "counters.invitations.TOTAL": 0 });
    }
    if (searchData.userTypes.includes("NONE")) {
      tempQuery["$or"].push({
        "counters.invitations.TOTAL": 0,
        "counters.users.TOTAL": 0,
      });
    }

    query["$and"].push(tempQuery);
  }

  return query;
};
