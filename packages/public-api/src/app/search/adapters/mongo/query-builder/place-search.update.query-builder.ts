import { type Document } from 'mongodb';
import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions } from './utils';
import { DateTime } from 'luxon';

export class UpdateQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const conditions: Document[] = [];

    if (query.updatedOn) {
      conditions.push({
        updatedAt: {
          $gte: this.asStartOfUtcDay(query.updatedOn),
          $lte: this.asEndOfUtcDay(query.updatedOn),
        },
      });
      return appendAndConditions(context, conditions);
    }

    if (query.updatedAfter) {
      conditions.push({
        updatedAt: {
          $gte: this.asStartOfUtcDay(query.updatedAfter),
        },
      });
    }

    if (query.updatedBefore) {
      conditions.push({
        updatedAt: {
          $lte: this.asEndOfUtcDay(query.updatedBefore),
        },
      });
    }

    return appendAndConditions(context, conditions);
  }

  private asStartOfUtcDay(dateValue: string): Date {
    return DateTime.fromISO(dateValue, { zone: 'utc' })
      .startOf('day')
      .toJSDate();
  }

  private asEndOfUtcDay(dateValue: string): Date {
    return DateTime.fromISO(dateValue, { zone: 'utc' }).endOf('day').toJSDate();
  }
}
