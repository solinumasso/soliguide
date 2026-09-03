import { UserStatus } from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class ApiUserCategoryLimitationsPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (context.userStatus !== UserStatus.API_USER) {
      return query;
    }

    const categoriesLimitations = context.categoriesLimitations ?? [];
    const categories = query.categories ?? [];

    if (!categories.length) {
      if (!categoriesLimitations.length) {
        return query;
      }

      return {
        ...query,
        categories: [...categoriesLimitations],
      };
    }

    if (!categoriesLimitations.length) {
      return query;
    }

    return {
      ...query,
      categories: categories.filter((category) =>
        categoriesLimitations.includes(category)
      ),
    };
  }
}
