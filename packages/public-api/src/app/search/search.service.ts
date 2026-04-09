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
    const page = query.pagination?.page ?? DEFAULT_PAGE;
    const limit = Math.min(
      query.pagination?.limit ?? DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const { records, totalResults } = await this.placeSearchReader.search(
      query,
      {
        page,
        limit,
      },
    );

    return {
      results: records.map((document) => this.resultMapper.mapPlace(document)),
      nbResults: totalResults,
    };
  }
}
