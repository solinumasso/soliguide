import dot from "dot-object";
import { FilterQuery } from "mongoose";

import { PlaceChangesSection } from "@soliguide/common";
import { User } from "../../_models";
import { parseTerritories, parseTextSearch } from "../../search/utils";
import { PlaceChanges } from "../interfaces/PlaceChanges.interface";

export const createPlaceChangesSearchQuery = (
  searchData: any,
  user: User
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
