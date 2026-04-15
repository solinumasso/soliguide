import { Categories, PlaceType, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { NonAdminUserStatus } from "../search-query";
import { ApiUserCategoryLimitationsPolicy } from "./api-user-category-limitations.policy";

describe("ApiUserCategoryLimitationsPolicy", () => {
  const policy = new ApiUserCategoryLimitationsPolicy();

  it.each([
    UserStatus.PRO,
    UserStatus.SIMPLE_USER,
    UserStatus.SOLI_BOT,
    UserStatus.VOLUNTEER,
    UserStatus.WIDGET_USER,
  ])("does nothing when user is %s", (status: UserStatus) => {
    const result = policy.apply(
      {
        placeType: PlaceType.PLACE,
        categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
      },
      {
        userStatus: status as NonAdminUserStatus,
        categoriesLimitations: [Categories.DOMICILIATION],
      }
    );

    expect(result.categories).toEqual([
      Categories.FOOD_DISTRIBUTION,
      Categories.DOMICILIATION,
    ]);
  });

  it("defaults categories to categoriesLimitations when API_USER query has no categories", () => {
    const result = policy.apply(
      { placeType: PlaceType.PLACE },
      {
        userStatus: UserStatus.API_USER,
        categoriesLimitations: [
          Categories.DOMICILIATION,
          Categories.HYGIENE_AND_WELLNESS,
        ],
      }
    );

    expect(result.categories).toEqual([
      Categories.DOMICILIATION,
      Categories.HYGIENE_AND_WELLNESS,
    ]);
  });

  it("intersects categories with categoriesLimitations for API_USER", () => {
    const result = policy.apply(
      {
        placeType: PlaceType.PLACE,
        categories: [
          Categories.FOOD_DISTRIBUTION,
          Categories.DOMICILIATION,
          Categories.HYGIENE_AND_WELLNESS,
        ],
      },
      {
        userStatus: UserStatus.API_USER,
        categoriesLimitations: [Categories.DOMICILIATION],
      }
    );

    expect(result.categories).toEqual([Categories.DOMICILIATION]);
  });

  it("keeps categories unchanged when API_USER has no categoriesLimitations", () => {
    const result = policy.apply(
      {
        placeType: PlaceType.PLACE,
        categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
      },
      { userStatus: UserStatus.API_USER }
    );

    expect(result.categories).toEqual([
      Categories.FOOD_DISTRIBUTION,
      Categories.DOMICILIATION,
    ]);
  });
});
