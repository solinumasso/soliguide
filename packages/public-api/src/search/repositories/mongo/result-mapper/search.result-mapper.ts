import { Injectable } from "@nestjs/common";

import { SearchResult } from "../../../search-result/search-result.type";

@Injectable()
export class SearchResultMapper {
  map(mongoResult: MongoSearchRawResult): SearchResult {
    const nbResults = mongoResult.countResult?.[0]?.totalResults ?? 0;

    return {
      nbResults,
      places: mongoResult.places,
    } as SearchResult;
  }
}

type MongoSearchRawResult = {
  places: Record<string, unknown>[];
  countResult: Array<{ totalResults?: number }>;
};
