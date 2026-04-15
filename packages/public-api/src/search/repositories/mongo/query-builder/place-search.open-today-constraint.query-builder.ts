import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { mergeServiceElemMatchCondition } from "./utils";

@Injectable()
export class OpenTodayConstraintQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.openToday) {
      return context;
    }

    return mergeServiceElemMatchCondition(context, { isOpenToday: true });
  }
}
