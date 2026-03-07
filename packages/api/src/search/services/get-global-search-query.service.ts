import { FilterQuery } from "mongoose";

import { User } from "../../_models/users";
import { parseTerritories, parseTextSearch } from "../utils";

export function getGlobalSearchQuery<
  T extends { [key: string]: any },
  K extends Partial<keyof T>
>(searchData: T, searchFields: K[], user: User): FilterQuery<T> {
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
