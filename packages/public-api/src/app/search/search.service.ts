import { Inject, Injectable } from '@nestjs/common';
import {
  PLACE_SEARCH_READER,
  type PlaceSearchReader,
} from './ports/place-search-reader.port';
import { SearchResultMapper } from './adapters/mongo/result-mapper/search-result.mapper';
import { type SearchQuery, type SearchResponse } from './search.types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_PAGE = 1;

@Injectable()
export class SearchService {
  constructor(
    @Inject(PLACE_SEARCH_READER)
    private readonly placeSearchReader: PlaceSearchReader,
    private readonly resultMapper: SearchResultMapper,
  ) {}

  async search(query: SearchQuery): Promise<SearchResponse> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

    const { records, totalResults } = await this.placeSearchReader.search(
      query,
      {
        page,
        limit,
      },
    );

    const totalPages = Math.max(1, Math.ceil(totalResults / limit));

    return {
      _links: this.buildLinks(query, page, limit, totalPages),
      results: records.map((document) => this.resultMapper.mapPlace(document)),
      page: {
        current: page,
        limit,
        totalPages,
        totalResults,
      },
    };
  }

  private buildLinks(
    query: SearchQuery,
    currentPage: number,
    limit: number,
    totalPages: number,
  ): SearchResponse['_links'] {
    const selfHref = buildSearchHref(query, currentPage, limit);

    return {
      self: { href: selfHref },
      next:
        currentPage < totalPages
          ? { href: buildSearchHref(query, currentPage + 1, limit) }
          : null,
      prev:
        currentPage > 1
          ? { href: buildSearchHref(query, currentPage - 1, limit) }
          : null,
    };
  }
}

function buildSearchHref(
  query: SearchQuery,
  page: number,
  limit: number,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || key === 'page' || key === 'limit') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item));
      }
      continue;
    }

    searchParams.set(key, String(value));
  }

  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  return `/search?${searchParams.toString()}`;
}
