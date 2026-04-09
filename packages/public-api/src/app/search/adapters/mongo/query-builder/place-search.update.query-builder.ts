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
    const updatedOn = query.updatedAt?.on;
    const updatedAfter = query.updatedAt?.after;
    const updatedBefore = query.updatedAt?.before;
    const conditions: Document[] = [];

    if (updatedOn) {
      conditions.push({
        updatedAt: {
          $gte: this.asStartOfUtcDay(updatedOn),
          $lte: this.asEndOfUtcDay(updatedOn),
        },
      });
      return appendAndConditions(context, conditions);
    }

    if (updatedAfter) {
      conditions.push({
        updatedAt: {
          $gte: this.asStartOfUtcDay(updatedAfter),
        },
      });
    }

    if (updatedBefore) {
      conditions.push({
        updatedAt: {
          $lte: this.asEndOfUtcDay(updatedBefore),
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
