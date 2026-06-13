import { Categories, PlaceType, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "./search-query";
import { SearchQueryPolicyPipeline } from "./search-query-policy.pipeline";
import { SearchPolicyContext, SearchQueryPolicy } from "./search-query-policy";

describe("SearchQueryPolicyPipeline", () => {
  it("applies provided policies in declaration order", () => {
    const executionOrder: string[] = [];
    const policies: SearchQueryPolicy[] = [
      new TrackPolicy("first", executionOrder),
      new TrackPolicy("second", executionOrder),
      new TrackPolicy("third", executionOrder),
    ];
    const pipeline = new SearchQueryPolicyPipeline(policies);

    pipeline.apply({} as SearchQuery, {
      userStatus: UserStatus.SIMPLE_USER,
    });

    expect(executionOrder).toEqual(["first", "second", "third"]);
  });

  it("uses default policies to shape an API_USER query", () => {
    const pipeline = new SearchQueryPolicyPipeline();

    const result = pipeline.apply(
      {
        placeType: PlaceType.PLACE,
        categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
      },
      {
        userStatus: UserStatus.API_USER,
        categoriesLimitations: [Categories.DOMICILIATION],
      }
    );

    expect(result.serviceFiltersEnabled).toBe(true);
    expect(result.categories).toEqual([Categories.DOMICILIATION]);
  });
});

class TrackPolicy implements SearchQueryPolicy {
  constructor(
    private readonly name: string,
    private readonly executionOrder: string[]
  ) {}

  apply(query: SearchQuery, _context: SearchPolicyContext): SearchQuery {
    this.executionOrder.push(this.name);
    return query;
  }
}
