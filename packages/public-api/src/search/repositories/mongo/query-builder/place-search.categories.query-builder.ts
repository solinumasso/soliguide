import { Injectable } from "@nestjs/common";
import { DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION } from "@soliguide/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { mergeServiceElemMatchCondition } from "./utils";

@Injectable()
export class CategoriesQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (context.query.serviceFiltersEnabled === false) {
      return context;
    }

    const categories = context.query.categories ?? [];
    const categoryCondition = categories.length
      ? { $in: categories }
      : { $nin: DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION };

    return mergeServiceElemMatchCondition(
      context,
      {
        category: categoryCondition,
      },
      { createWhenMissing: true }
    );
  }
}
