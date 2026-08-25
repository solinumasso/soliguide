import { SearchQuery } from "../search-query/search-query";
import { PlaceAccessQuery } from "../search-query/place-access.query";
import { SearchPlace, SearchResult } from "../search-result/search-result.type";

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface PlacesRepository {
  getByIdentifier(
    identifier: string,
    accessQuery: PlaceAccessQuery
  ): Promise<SearchPlace | undefined>;
  search(
    query: SearchQuery,
    pagination: SearchPagination
  ): Promise<SearchResult>;
}

export const PLACES_REPOSITORY = Symbol("PlacesRepository");
