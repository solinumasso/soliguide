import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions } from './utils';

export class TextQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const textQuery = context.query.q;
    if (!textQuery) {
      return context;
    }

    const regex = new RegExp(this.escapeRegex(textQuery), 'i');

    return appendAndConditions(context, [
      {
        $or: [
          { name: regex },
          { description: regex },
          { 'slugs.infos.name': regex },
          { seo_url: regex },
        ],
      },
    ]);
  }

  private escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
