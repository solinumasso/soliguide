import { type Document } from 'mongodb';
import { type SearchQuery } from '../../../search.types';

export interface SearchContext {
  query: SearchQuery;
  andConditions: Document[];
  geoNearStage: Document | null;
}

export interface SearchQueryBuilder {
  build(context: SearchContext): SearchContext;
}
