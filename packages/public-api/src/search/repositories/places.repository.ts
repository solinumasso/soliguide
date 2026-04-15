import { SearchQuery } from "../search-query/search-query";
import { SearchResult } from "../search-result/search-result.type";

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface PlacesRepository {
  search(
    query: SearchQuery,
    pagination: SearchPagination
  ): Promise<SearchResult>;
}

export const PLACES_REPOSITORY = Symbol("PlacesRepository");
