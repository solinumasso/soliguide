import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { OpenTodayConstraintQueryBuilder } from "./place-search.open-today-constraint.query-builder";
import { SearchContext } from "./search.query-builder";

describe("OpenTodayConstraintQueryBuilder", () => {
  const builder = new OpenTodayConstraintQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when openToday is not enabled", () => {
    const context = buildContext({ openToday: false });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when openToday is enabled but no service condition exists", () => {
    const context = buildContext({ openToday: true });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("adds isOpenToday on existing services_all.$elemMatch condition", () => {
    const context = buildContext(
      { openToday: true },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {
                category: { $in: ["food"] },
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
            category: { $in: ["food"] },
            isOpenToday: true,
          },
        },
      },
    ]);
    expect(context.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            category: { $in: ["food"] },
          },
        },
      },
    ]);
  });

  it("overwrites existing isOpenToday value to true", () => {
    const context = buildContext(
      { openToday: true },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {
                isOpenToday: false,
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
            isOpenToday: true,
          },
        },
      },
    ]);
  });

  it("returns unchanged context when service filters are explicitly disabled", () => {
    const context = buildContext(
      {
        openToday: true,
        serviceFiltersEnabled: false,
      },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {},
            },
          },
        ],
      }
    );

    const result = builder.build(context);

    expect(result).toBe(context);
  });
});
