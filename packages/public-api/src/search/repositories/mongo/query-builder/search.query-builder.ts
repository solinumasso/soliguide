import { Injectable } from "@nestjs/common";
import { type Document } from "mongodb";
import { type PipelineStage } from "mongoose";

import { SearchQuery } from "../../../search-query/search-query";

import { ApiUserRestrictionsQueryBuilder } from "./place-search.api-user-restrictions.query-builder";
import { AudienceQueryBuilder } from "./place-search.audience.query-builder";
import { CategoriesQueryBuilder } from "./place-search.categories.query-builder";
import { LanguagePreferenceQueryBuilder } from "./place-search.language-preference.query-builder";
import { LocationQueryBuilder } from "./place-search.location.query-builder";
import { ModalitiesQueryBuilder } from "./place-search.modalities.query-builder";
import { OpenTodayConstraintQueryBuilder } from "./place-search.open-today-constraint.query-builder";
import { StatusQueryBuilder } from "./place-search.status.query-builder";
import { TextQueryBuilder } from "./place-search.text.query-builder";
import { UpdateQueryBuilder } from "./place-search.update.query-builder";
import { VisibilityQueryBuilder } from "./place-search.visibility.query-builder";

@Injectable()
export class PlacesSearchQueryBuilder {
  private readonly stepBuilders: SearchQueryBuilder[];

  constructor() {
    this.stepBuilders = [
      new ApiUserRestrictionsQueryBuilder(),
      new TextQueryBuilder(),
      new LocationQueryBuilder(),
      new StatusQueryBuilder(),
      new VisibilityQueryBuilder(),
      new CategoriesQueryBuilder(),
      new AudienceQueryBuilder(),
      new ModalitiesQueryBuilder(),
      new OpenTodayConstraintQueryBuilder(),
      new UpdateQueryBuilder(),
      new LanguagePreferenceQueryBuilder(),
    ];
  }

  build(
    query: SearchQuery,
    pagination: { page: number; limit: number }
  ): MongoSearchPipelines {
    let context = this.initializeSearchContext(query);

    for (const stepBuilder of this.stepBuilders) {
      context = stepBuilder.build(context);
    }

    return this.buildPipelines(context, pagination);
  }

  private initializeSearchContext(query: SearchQuery): SearchContext {
    return {
      query,
      andConditions: [],
      geoNearStage: null,
    };
  }

  private buildPipelines(
    context: SearchContext,
    pagination: { page: number; limit: number }
  ): MongoSearchPipelines {
    const skip = Math.max(0, pagination.page - 1) * pagination.limit;
    const matchStage = this.buildMatchStage(context.andConditions);
    const hasGeoNearStage = Boolean(context.geoNearStage);

    const basePipeline: PipelineStage[] = [];

    if (context.geoNearStage) {
      basePipeline.push({
        $geoNear: {
          ...context.geoNearStage,
          ...(Object.keys(matchStage).length ? { query: matchStage } : {}),
        },
      } as PipelineStage.GeoNear);
    } else if (Object.keys(matchStage).length) {
      basePipeline.push({
        $match: matchStage,
      });
    }

    const projectStage = this.buildProjectStage(context);

    const addFieldsStage = this.buildAddFieldsStage(context);
    const sortStage = this.buildSortStage(context, hasGeoNearStage);

    return {
      resultsPipeline: [
        ...basePipeline,
        ...(projectStage ? [{ $project: projectStage }] : []),
        ...(addFieldsStage ? [{ $addFields: addFieldsStage }] : []),
        ...(sortStage ? [{ $sort: sortStage }] : []),
        { $skip: skip },
        { $limit: pagination.limit },
      ],
      countPipeline: [...basePipeline, { $count: "totalResults" }],
    };
  }

  private buildProjectStage(
    context: SearchContext
  ): Record<string, boolean> | null {
    const selectedFields =
      context.query.resultFields ?? context.query.options?.fields;

    if (!selectedFields) {
      return null;
    }

    const tokens = selectedFields
      .split(" ")
      .map((token) => token.trim())
      .filter(Boolean);

    if (!tokens.length) {
      return null;
    }

    return tokens.reduce<Record<string, boolean>>((acc, token) => {
      if (token.startsWith("-")) {
        acc[token.slice(1)] = false;
      } else {
        acc[token] = true;
      }

      return acc;
    }, {});
  }

  private buildMatchStage(andConditions: Document[]): Document {
    if (!andConditions.length) {
      return {};
    }

    if (andConditions.length === 1) {
      return andConditions[0];
    }

    return {
      $and: andConditions,
    };
  }

  private buildAddFieldsStage(context: SearchContext): Document | null {
    if (!context.query.closedPlacesLast) {
      return null;
    }

    return {
      statusSort: {
        $cond: {
          if: { $eq: ["$status", "PERMANENTLY_CLOSED"] },
          then: 1,
          else: 0,
        },
      },
    };
  }

  private buildSortStage(
    context: SearchContext,
    hasGeoNearStage: boolean
  ): Record<string, 1 | -1> | null {
    const sortBy = context.query.options?.sortBy;
    const sortValue = context.query.options?.sortValue;
    const closedPlacesLast = context.query.closedPlacesLast === true;

    if (
      sortBy &&
      typeof sortBy === "string" &&
      typeof sortValue === "number" &&
      (sortValue === 1 || sortValue === -1)
    ) {
      const requestedSort = {
        [sortBy]: sortValue,
      };

      if (!closedPlacesLast) {
        return requestedSort;
      }

      return {
        ...requestedSort,
        statusSort: 1,
        ...(hasGeoNearStage ? { distance: 1 } : {}),
      };
    }

    if (!closedPlacesLast) {
      return null;
    }

    return {
      statusSort: 1,
      ...(hasGeoNearStage ? { distance: 1 } : {}),
    };
  }
}

type MongoSearchPipelines = {
  resultsPipeline: PipelineStage[];
  countPipeline: PipelineStage[];
};

export interface SearchQueryBuilder {
  build(context: SearchContext): SearchContext;
}

export interface SearchContext {
  query: SearchQuery;
  andConditions: Record<string, unknown>[];
  geoNearStage: Record<string, unknown> | null;
}
