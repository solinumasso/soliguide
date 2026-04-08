import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions } from './utils';

export class LanguagePreferenceQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const language = context.query.language;
    if (!language) {
      return context;
    }

    return appendAndConditions(context, [{ languages: { $in: [language] } }]);
  }
}
