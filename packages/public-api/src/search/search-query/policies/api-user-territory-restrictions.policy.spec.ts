import { CountryCodes, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../search-query";
import { ApiUserTerritoryRestrictionsPolicy } from "./api-user-territory-restrictions.policy";

describe("ApiUserTerritoryRestrictionsPolicy", () => {
  const policy = new ApiUserTerritoryRestrictionsPolicy();

  it("does nothing for non API_USER", () => {
    const query: SearchQuery = {};

    const result = policy.apply(query, {
      userStatus: UserStatus.SIMPLE_USER,
    });

    expect(result).toEqual(query);
  });

  it("applies france restriction when API_USER has no areas", () => {
    const query: SearchQuery = {};

    const result = policy.apply(query, {
      userStatus: UserStatus.API_USER,
    });

    expect(result.apiUserRestrictions).toEqual({
      $or: [
        {
          "position.departmentCode": { $in: [] },
          "position.country": CountryCodes.FR,
        },
        {
          "parcours.position.departmentCode": { $in: [] },
          "parcours.position.country": CountryCodes.FR,
        },
      ],
    });
  });

  it("applies single-country API_USER territory restriction", () => {
    const query: SearchQuery = {};

    const result = policy.apply(query, {
      userStatus: UserStatus.API_USER,
      areas: {
        fr: {
          departments: ["75", "93"],
        },
      },
    });

    expect(result.apiUserRestrictions).toEqual({
      $or: [
        {
          "position.departmentCode": { $in: ["75", "93"] },
          "position.country": "fr",
        },
        {
          "parcours.position.departmentCode": { $in: ["75", "93"] },
          "parcours.position.country": "fr",
        },
      ],
    });
  });

  it("applies multi-country API_USER territory restriction", () => {
    const query: SearchQuery = {};

    const result = policy.apply(query, {
      userStatus: UserStatus.API_USER,
      areas: {
        fr: {
          departments: ["75"],
        },
        es: {
          departments: ["08"],
        },
      },
    });

    expect(result.apiUserRestrictions).toEqual({
      $or: [
        {
          $or: [
            {
              "position.departmentCode": { $in: ["75"] },
              "position.country": "fr",
            },
            {
              "parcours.position.departmentCode": { $in: ["75"] },
              "parcours.position.country": "fr",
            },
          ],
        },
        {
          $or: [
            {
              "position.departmentCode": { $in: ["08"] },
              "position.country": "es",
            },
            {
              "parcours.position.departmentCode": { $in: ["08"] },
              "parcours.position.country": "es",
            },
          ],
        },
      ],
    });
  });
});
