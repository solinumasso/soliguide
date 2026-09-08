import { Injectable } from "@nestjs/common";

import { PlaceModel } from "@soliguide/api";

import {
  PlacesRepository,
  SearchPagination,
} from "../../repositories/places.repository";
import { SearchQuery } from "../../search-query/search-query";
import { PlaceAccessQuery } from "../../search-query/place-access.query";
import { SearchPlace, SearchResult } from "../../search-result/search-result.type";
import { MongoPlace } from "./place.mongo";
import { PlacesSearchQueryBuilder } from "./query-builder/search.query-builder";
import { SearchResultMapper } from "./result-mapper/search.result-mapper";

@Injectable()
export class PlacesMongoRepository implements PlacesRepository {
  constructor(
    private readonly queryBuilder: PlacesSearchQueryBuilder,
    private readonly resultMapper: SearchResultMapper
  ) {}

  async getByIdentifier(
    identifier: string,
    accessQuery: PlaceAccessQuery
  ): Promise<SearchPlace | undefined> {
    const identifierQuery = /^\d+$/.test(identifier)
      ? { lieu_id: Number(identifier) }
      : { seo_url: identifier };
    const place = await PlaceModel.findOne({
      ...identifierQuery,
      ...accessQuery,
    })
      .lean()
      .exec();

    return place
      ? this.resultMapper.mapPlace(place as unknown as MongoPlace)
      : undefined;
  }

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
