import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { SearchContext } from "./search.query-builder";
import { TextQueryBuilder } from "./place-search.text.query-builder";

describe("TextQueryBuilder", () => {
  const builder = new TextQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when word is missing", () => {
    const context = buildContext({});

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when word is only whitespace", () => {
    const context = buildContext({ word: "   \n\t " });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("adds OR regex conditions for the supported text fields", () => {
    const context = buildContext({ word: "Paris" });

    const result = builder.build(context);
    const textCondition = result.andConditions[0] as {
      $or: Array<Record<string, RegExp>>;
    };

    expect(result.andConditions).toHaveLength(1);
    expect(textCondition.$or).toHaveLength(4);
    expect(Object.keys(textCondition.$or[0])[0]).toBe("name");
    expect(Object.keys(textCondition.$or[1])[0]).toBe("description");
    expect(Object.keys(textCondition.$or[2])[0]).toBe("entity.name");
    expect(Object.keys(textCondition.$or[3])[0]).toBe("services_all.name");

    for (const condition of textCondition.$or) {
      const regex = Object.values(condition)[0];

      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toBe("Paris");
      expect(regex.flags).toBe("i");
    }
  });

  it("trims and escapes regex metacharacters in word", () => {
    const context = buildContext({ word: "  a+b?(test)  " });

    const result = builder.build(context);
    const regex = Object.values(
      (result.andConditions[0] as { $or: Array<Record<string, RegExp>> }).$or[0]
    )[0];

    expect(regex.source).toBe("a\\+b\\?\\(test\\)");
    expect(regex.flags).toBe("i");
  });

  it("preserves existing andConditions and appends text condition", () => {
    const context = buildContext(
      { word: "food" },
      {
        andConditions: [{ status: "ONLINE" }],
      }
    );

    const result = builder.build(context);

    expect(context.andConditions).toEqual([{ status: "ONLINE" }]);
    expect(result.andConditions).toHaveLength(2);
    expect(result.andConditions[0]).toEqual({ status: "ONLINE" });
    expect(result.geoNearStage).toBeNull();
  });
});
