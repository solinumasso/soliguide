import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class VisibilityPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (!context.placeAccess.visibility) {
      return query;
    }

    return {
      ...query,
      visibility: context.placeAccess.visibility,
    };
  }
}
