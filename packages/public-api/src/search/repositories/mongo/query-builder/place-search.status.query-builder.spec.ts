import { PlaceStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { StatusQueryBuilder } from "./place-search.status.query-builder";
import { SearchContext } from "./search.query-builder";

describe("StatusQueryBuilder", () => {
  const builder = new StatusQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when status is missing", () => {
    const context = buildContext({});

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("adds status match condition", () => {
    const context = buildContext({ status: PlaceStatus.ONLINE });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([{ status: PlaceStatus.ONLINE }]);
    expect(context.andConditions).toEqual([]);
  });

  it("preserves existing andConditions and appends status", () => {
    const context = buildContext(
      { status: PlaceStatus.DRAFT },
      {
        andConditions: [{ visibility: "all" }],
      }
    );

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      { visibility: "all" },
      { status: PlaceStatus.DRAFT },
    ]);
    expect(context.andConditions).toEqual([{ visibility: "all" }]);
  });
});
