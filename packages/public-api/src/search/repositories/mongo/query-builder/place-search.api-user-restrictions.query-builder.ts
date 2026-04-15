import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { appendAndConditions } from "./utils";

@Injectable()
export class ApiUserRestrictionsQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.apiUserRestrictions) {
      return context;
    }

    return appendAndConditions(context, context.query.apiUserRestrictions);
  }
}
