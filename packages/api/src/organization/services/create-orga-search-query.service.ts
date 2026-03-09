import { ApiOrganization, CAMPAIGN_DEFAULT_NAME } from "@soliguide/common";

import { UserPopulateType } from "../../_models";
import { getPlaceByParams } from "../../place/services/place.service";
import { getGlobalSearchQuery } from "../../search/services";
import { parseTerritories } from "../../search/utils";
import { FilterQuery } from "mongoose";

export const createOrgaSearchQuery = async (
  searchData: FilterQuery<ApiOrganization>,
  user: UserPopulateType
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
      lieu_id: searchData.lieu_id,
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
