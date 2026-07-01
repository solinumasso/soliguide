import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { appendAndConditions } from "./utils";

@Injectable()
export class VisibilityQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.visibility) {
      return context;
    }

    return appendAndConditions(context, {
      visibility: context.query.visibility,
    });
  }
}
