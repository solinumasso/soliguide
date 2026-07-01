import { Injectable } from "@nestjs/common";

import { PlaceModel } from "@soliguide/api/src";

import {
  PlacesRepository,
  SearchPagination,
} from "../../repositories/places.repository";
import { SearchQuery } from "../../search-query/search-query";
import { SearchResult } from "../../search-result/search-result.type";
import { PlacesSearchQueryBuilder } from "./query-builder/search.query-builder";
import { SearchResultMapper } from "./result-mapper/search.result-mapper";

@Injectable()
export class PlacesMongoRepository implements PlacesRepository {
  constructor(
    private readonly queryBuilder: PlacesSearchQueryBuilder,
    private readonly resultMapper: SearchResultMapper
  ) {}

  async search(
    query: SearchQuery,
    pagination: SearchPagination
  ): Promise<SearchResult> {
    const { resultsPipeline, countPipeline } = this.queryBuilder.build(
      query,
      pagination
    );

    const [places, countResult] = await Promise.all([
      PlaceModel.aggregate(resultsPipeline).allowDiskUse(true),
      PlaceModel.aggregate(countPipeline).allowDiskUse(true),
    ]);

    return this.resultMapper.map({
      places,
      countResult,
    });
  }
}
