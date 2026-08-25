import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class OnlineStatusPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    return {
      ...query,
      status: context.placeAccess.status,
    };
  }
}
