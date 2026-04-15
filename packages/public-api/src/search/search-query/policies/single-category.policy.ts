import { UserStatus } from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { NonAdminUserStatus, SearchQuery } from "../search-query";

export class SingleCategoryPolicy implements SearchQueryPolicy {
  private readonly statusesWithSingleCategory = new Set<NonAdminUserStatus>([
    UserStatus.PRO,
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
  ]);

  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (!this.statusesWithSingleCategory.has(context.userStatus)) {
      return query;
    }

    const categories = query.categories ?? [];
    if (categories.length <= 1) {
      return query;
    }

    return {
      ...query,
      categories: [categories[0]],
    };
  }
}
