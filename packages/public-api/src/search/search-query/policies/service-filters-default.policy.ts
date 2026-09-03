import { SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class ServiceFiltersDefaultPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery): SearchQuery {
    if (typeof query.serviceFiltersEnabled === "boolean") {
      return query;
    }

    return {
      ...query,
      serviceFiltersEnabled: true,
    };
  }
}
