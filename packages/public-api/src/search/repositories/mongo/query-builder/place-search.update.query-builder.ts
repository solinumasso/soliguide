import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { appendAndConditions } from "./utils";

@Injectable()
export class UpdateQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const updatedAt = context.query.updatedAt;

    if (!updatedAt || !updatedAt.value) {
      return context;
    }

    const date = new Date(updatedAt.value);

    if (Number.isNaN(date.getTime())) {
      return context;
    }

    return appendAndConditions(context, {
      updatedAt: {
        $gte: date,
      },
    });
  }
}
