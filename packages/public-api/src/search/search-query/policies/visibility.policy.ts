import {
  PlaceVisibility,
  UserStatus,
  UserStatusNotLogged,
} from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { NonAdminUserStatus, SearchQuery } from "../search-query";

export class AllVisibilityPolicy implements SearchQueryPolicy {
  private readonly statusesWithAllVisibility = new Set<NonAdminUserStatus>([
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
    UserStatus.WIDGET_USER,
    UserStatus.API_USER,
    UserStatus.SOLI_BOT,
    UserStatusNotLogged.NOT_LOGGED,
  ]);

  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (!this.statusesWithAllVisibility.has(context.userStatus)) {
      return query;
    }

    return {
      ...query,
      visibility: PlaceVisibility.ALL,
    };
  }
}
