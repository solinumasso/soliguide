import { Categories, PlaceType, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../search-query";
import { SingleCategoryPolicy } from "./single-category.policy";

describe("SingleCategoryPolicy", () => {
  const policy = new SingleCategoryPolicy();
  const query = {
    placeType: PlaceType.PLACE,
    categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
  } as SearchQuery;

  it("keeps only first category for PRO", () => {
    const result = policy.apply(query, { userStatus: UserStatus.PRO });

    expect(result.categories).toEqual([Categories.FOOD_DISTRIBUTION]);
  });

  it("keeps only first category for SIMPLE_USER", () => {
    const result = policy.apply(query, { userStatus: UserStatus.SIMPLE_USER });
    expect(result.categories).toEqual([Categories.FOOD_DISTRIBUTION]);
  });

  it("keeps only first category for VOLUNTEER", () => {
    const result = policy.apply(query, { userStatus: UserStatus.VOLUNTEER });
    expect(result.categories).toEqual([Categories.FOOD_DISTRIBUTION]);
  });

  it("keeps all categories for API_USER", () => {
    const result = policy.apply(query, { userStatus: UserStatus.API_USER });

    expect(result.categories).toEqual([
      Categories.FOOD_DISTRIBUTION,
      Categories.DOMICILIATION,
    ]);
  });

  it("returns unchanged query when categories are missing", () => {
    const result = policy.apply(
      { placeType: PlaceType.PLACE },
      { userStatus: UserStatus.PRO }
    );

    expect(result.categories).toBeUndefined();
  });
});
