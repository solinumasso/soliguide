import { type SearchQuery } from '../search.types';
import { type MongoPlaceDocument } from '../adapters/mongo/place.mongo';

export const PLACE_SEARCH_READER = 'PLACE_SEARCH_READER';

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface PlaceSearchReadResult {
  records: MongoPlaceDocument[];
  totalResults: number;
}

export interface PlaceSearchReader {
  search(
    query: SearchQuery,
    pagination: SearchPagination,
  ): Promise<PlaceSearchReadResult>;
}
