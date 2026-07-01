import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";

@Injectable()
export class LanguagePreferenceQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.languages) {
      return context;
    }

    return {
      ...context,
      andConditions: [
        ...context.andConditions,
        {
          languages: {
            $in: [context.query.languages],
          },
        },
      ],
    };
  }
}
