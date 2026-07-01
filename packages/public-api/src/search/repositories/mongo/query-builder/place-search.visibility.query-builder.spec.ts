import { PlaceVisibility } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { SearchContext } from "./search.query-builder";
import { VisibilityQueryBuilder } from "./place-search.visibility.query-builder";

describe("VisibilityQueryBuilder", () => {
  const builder = new VisibilityQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when visibility is missing", () => {
    const context = buildContext({});

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("adds visibility match condition", () => {
    const context = buildContext({ visibility: PlaceVisibility.ALL });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([{ visibility: PlaceVisibility.ALL }]);
    expect(context.andConditions).toEqual([]);
  });

  it("preserves existing andConditions and appends visibility", () => {
    const context = buildContext(
      { visibility: PlaceVisibility.ALL },
      {
        andConditions: [{ status: "ONLINE" }],
      }
    );

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      { status: "ONLINE" },
      { visibility: PlaceVisibility.ALL },
    ]);
    expect(context.andConditions).toEqual([{ status: "ONLINE" }]);
  });
});
