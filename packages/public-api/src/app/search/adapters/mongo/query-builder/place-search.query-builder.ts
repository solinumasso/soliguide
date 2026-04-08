import { Injectable } from '@nestjs/common';
import { type Document } from 'mongodb';
import { type SearchQuery } from '../../../search.types';
import { AccessQueryBuilder } from './place-search.access.query-builder';
import { AudienceQueryBuilder } from './place-search.audience.query-builder';
import { LanguagePreferenceQueryBuilder } from './place-search.language-preference.query-builder';
import { LocationQueryBuilder } from './place-seach.location.query-builder';
import { OpenTodayConstraintQueryBuilder } from './place-search.open-today-constraint.query-builder';
import { ProximityRankingQueryBuilder } from './place-search.proximity-ranking.query-builder';
import { CategoriesQueryBuilder } from './place-search.categories.query-builder';
import { TextQueryBuilder } from './place-search.text.query-builder';
import { UpdateQueryBuilder } from './place-search.update.query-builder';
import { SearchContext, SearchQueryBuilder } from './search.query-builder';
import { buildMatchStage } from './utils';

@Injectable()
export class PlaceSearchQueryBuilder {
  private readonly translationStepBuilders: SearchQueryBuilder[];

  constructor() {
    this.translationStepBuilders = [
      new TextQueryBuilder(),
      new LocationQueryBuilder(),
      new CategoriesQueryBuilder(),
      new AccessQueryBuilder(),
      new AudienceQueryBuilder(),
      new OpenTodayConstraintQueryBuilder(),
      new UpdateQueryBuilder(),
      new LanguagePreferenceQueryBuilder(),
      new ProximityRankingQueryBuilder(),
    ];
  }

  build(
    query: SearchQuery,
    pagination: { page: number; limit: number },
  ): MongoSearchPipelines {
    let context = this.initializeSearchTranslation(query);

    for (const stepBuilder of this.translationStepBuilders) {
      context = stepBuilder.build(context);
    }

    return this.buildPipelines(context, pagination);
  }

  private initializeSearchTranslation(query: SearchQuery): SearchContext {
    return {
      query,
      andConditions: [],
      geoNearStage: null,
    };
  }

  private buildPipelines(
    context: SearchContext,
    pagination: { page: number; limit: number },
  ): MongoSearchPipelines {
    const skip = Math.max(0, pagination.page - 1) * pagination.limit;
    const matchStage = buildMatchStage(context.andConditions);
    const hasGeoNearStage = Boolean(context.geoNearStage);

    const basePipeline = [
      ...(context.geoNearStage ? [{ $geoNear: context.geoNearStage }] : []),
      ...(context.geoNearStage ? [] : [{ $match: matchStage }]),
    ];

    return {
      resultsPipeline: [
        ...basePipeline,
        { $sort: this.buildSortStage(hasGeoNearStage) },
        { $skip: skip },
        { $limit: pagination.limit },
      ],
      countPipeline: [...basePipeline, { $count: 'totalResults' }],
    };
  }

  private buildSortStage(hasGeoNearStage: boolean): Document {
    if (hasGeoNearStage) {
      return {
        distance: 1,
        updatedAt: -1,
      };
    }

    return {
      updatedAt: -1,
      lieu_id: 1,
    };
  }
}

type MongoSearchPipelines = {
  resultsPipeline: Document[];
  countPipeline: Document[];
};
