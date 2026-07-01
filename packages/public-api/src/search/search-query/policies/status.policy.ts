import { PlaceStatus } from "@soliguide/common";

import { SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class OnlineStatusPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery): SearchQuery {
    return {
      ...query,
      status: PlaceStatus.ONLINE,
    };
  }
}
