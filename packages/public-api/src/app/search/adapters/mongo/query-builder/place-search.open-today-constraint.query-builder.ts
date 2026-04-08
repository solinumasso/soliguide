import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions } from './utils';

export class OpenTodayConstraintQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.openToday) {
      return context;
    }

    return appendAndConditions(context, [
      {
        $or: [
          { isOpenToday: true },
          { services_all: { $elemMatch: { isOpenToday: true } } },
        ],
      },
    ]);
  }
}
