import {
  convertOldToNewMobilityCategory,
  isLegacyMobilityCategory,
  UserStatus,
} from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class ApiUserLegacyMobilityCategoriesPolicy
  implements SearchQueryPolicy
{
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (context.userStatus !== UserStatus.API_USER) {
      return query;
    }

    const categories = query.categories;
    if (!categories?.length) {
      return query;
    }

    return {
      ...query,
      categories: categories.map((category) => {
        if (!isLegacyMobilityCategory(category)) {
          return category;
        }

        return convertOldToNewMobilityCategory(category) ?? category;
      }),
    };
  }
}
