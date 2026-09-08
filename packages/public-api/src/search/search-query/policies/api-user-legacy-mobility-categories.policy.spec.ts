import { Categories, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../search-query";
import { ApiUserLegacyMobilityCategoriesPolicy } from "./api-user-legacy-mobility-categories.policy";

describe("ApiUserLegacyMobilityCategoriesPolicy", () => {
  const policy = new ApiUserLegacyMobilityCategoriesPolicy();

  it("converts legacy mobility category for API_USER", () => {
    const result = policy.apply(
      {
        categories: ["chauffeur_driven_transport" as unknown as Categories],
      } as SearchQuery,
      { userStatus: UserStatus.API_USER }
    );

    expect(result.categories).toEqual([Categories.TRANSPORTATION_MOBILITY]);
  });

  it("converts legacy mobility categories array for API_USER", () => {
    const result = policy.apply(
      {
        categories: [
          "carpooling" as unknown as Categories,
          "provision_of_vehicles" as unknown as Categories,
          Categories.DOMICILIATION,
        ],
      } as SearchQuery,
      { userStatus: UserStatus.API_USER }
    );

    expect(result.categories).toEqual([
      Categories.TRANSPORTATION_MOBILITY,
      Categories.PERSONAL_VEHICLE_ACCESS,
      Categories.DOMICILIATION,
    ]);
  });

  it("does not convert for non API_USER", () => {
    const result = policy.apply(
      {
        categories: ["carpooling" as unknown as Categories],
      } as SearchQuery,
      { userStatus: UserStatus.SIMPLE_USER }
    );

    expect(result.categories).toEqual(["carpooling"]);
  });
});
