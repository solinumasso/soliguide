import {
  Categories,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
} from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { CategoriesQueryBuilder } from "./place-search.categories.query-builder";
import { SearchContext } from "./search.query-builder";

describe("CategoriesQueryBuilder", () => {
  const builder = new CategoriesQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("applies default excluded categories when categories are missing", () => {
    const context = buildContext({ word: "food" });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: { $nin: DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION },
          },
        },
      },
    ]);
  });

  it("applies default excluded categories when categories are empty", () => {
    const context = buildContext({ categories: [] });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: { $nin: DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION },
          },
        },
      },
    ]);
  });

  it("applies selected categories with $in", () => {
    const context = buildContext({
      categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
    });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: {
              $in: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
            },
          },
        },
      },
    ]);
  });

  it("preserves existing service condition entries and appends category filter", () => {
    const context = buildContext(
      {
        categories: [Categories.INFORMATION_POINT],
      },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {
                "modalities.inconditionnel": true,
              },
            },
          },
        ],
      }
    );

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            "modalities.inconditionnel": true,
            category: { $in: [Categories.INFORMATION_POINT] },
          },
        },
      },
    ]);
    expect(context.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            "modalities.inconditionnel": true,
          },
        },
      },
    ]);
  });

  it("overwrites pre-existing category condition", () => {
    const context = buildContext(
      {
        categories: [Categories.INFORMATION_POINT],
      },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {
                category: { $nin: [Categories.FOOD_DISTRIBUTION] },
              },
            },
          },
        ],
      }
    );

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: { $in: [Categories.INFORMATION_POINT] },
          },
        },
      },
    ]);
  });

  it("applies default excluded categories when categories are not provided", () => {
    const context = buildContext({});

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: { $nin: DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION },
          },
        },
      },
    ]);
  });

  it("returns unchanged context when service filters are explicitly disabled", () => {
    const context = buildContext({
      categories: [Categories.INFORMATION_POINT],
      serviceFiltersEnabled: false,
    });

    const result = builder.build(context);

    expect(result).toBe(context);
  });
});
