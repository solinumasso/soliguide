import { Injectable } from '@nestjs/common';
import { PlacesDatabaseService } from './places-database.service';
import { type SearchQuery } from '../../search.types';
import {
  type PlaceSearchReadResult,
  type PlaceSearchReader,
  type SearchPagination,
} from '../../ports/place-search-reader.port';
import { PlaceSearchQueryBuilder } from './query-builder/place-search.query-builder';
import { type MongoPlaceDocument } from './place.mongo';

@Injectable()
export class MongoPlaceSearchReaderAdapter implements PlaceSearchReader {
  constructor(
    private readonly placesDatabaseService: PlacesDatabaseService,
    private readonly queryBuilder: PlaceSearchQueryBuilder,
  ) {}

  async search(
    query: SearchQuery,
    pagination: SearchPagination,
  ): Promise<PlaceSearchReadResult> {
    const { resultsPipeline, countPipeline } = this.queryBuilder.build(
      query,
      pagination,
    );

    const [records, countResult] = await Promise.all([
      this.placesDatabaseService.aggregatePlaces<MongoPlaceDocument>(
        resultsPipeline,
      ),
      this.placesDatabaseService.aggregatePlaces<{ totalResults: number }>(
        countPipeline,
      ),
    ]);

    return {
      records,
      totalResults: countResult[0]?.totalResults ?? 0,
    };
  }
}
