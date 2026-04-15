import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  WelcomedPublics,
} from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { AudienceQueryBuilder } from "./place-search.audience.query-builder";
import { SearchContext } from "./search.query-builder";

describe("AudienceQueryBuilder", () => {
  const builder = new AudienceQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when audiences are missing", () => {
    const context = buildContext({ word: "food" });
    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when audiences object has no effective filters", () => {
    const context = buildContext({
      audiences: {
        genders: [],
        administrativeStatuses: [],
        familyStatuses: [],
        otherStatuses: [],
      },
    });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when audiences are provided but no service condition exists", () => {
    const context = buildContext({
      audiences: {
        admissionPolicy: "open",
        genders: [],
        administrativeStatuses: [],
        familyStatuses: [],
        otherStatuses: [],
      },
    });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it.each([
    { admissionPolicy: "open", expected: WelcomedPublics.UNCONDITIONAL },
    { admissionPolicy: "restricted", expected: WelcomedPublics.PREFERENTIAL },
    { admissionPolicy: "targeted", expected: WelcomedPublics.EXCLUSIVE },
  ] as const)(
    "maps admissionPolicy '$admissionPolicy' to publics.accueil",
    ({ admissionPolicy, expected }) => {
      const context = buildContext(
        {
          audiences: {
            admissionPolicy,
            genders: [],
            administrativeStatuses: [],
            familyStatuses: [],
            otherStatuses: [],
          },
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

      expect(result.andConditions).toEqual([
        {
          services_all: {
            $elemMatch: {
              "publics.accueil": expected,
            },
          },
        },
      ]);
    }
  );

  it.each([1, 18, 98])(
    "maps age %s to inclusive min/max range filters",
    (age) => {
      const context = buildContext(
        {
          audiences: {
            age,
            genders: [],
            administrativeStatuses: [],
            familyStatuses: [],
            otherStatuses: [],
          },
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

      expect(result.andConditions).toEqual([
        {
          services_all: {
            $elemMatch: {
              "publics.age.min": { $lte: age },
              "publics.age.max": { $gte: age },
            },
          },
        },
      ]);
    }
  );

  it.each([undefined, 0, 99, 120])(
    "does not map age when value is %s",
    (age) => {
      const context = buildContext({
        audiences: {
          age: age as number | undefined,
          genders: [],
          administrativeStatuses: [],
          familyStatuses: [],
          otherStatuses: [],
        },
      });

      const result = builder.build(context);

      expect(result).toBe(context);
    }
  );

  it("maps all list fields to $in filters", () => {
    const context = buildContext(
      {
        audiences: {
          genders: [PublicsGender.women],
          administrativeStatuses: [PublicsAdministrative.refugee],
          familyStatuses: [PublicsFamily.couple],
          otherStatuses: [PublicsOther.lgbt],
        },
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

    expect(result.andConditions).toEqual([
      {
        services_all: {
          $elemMatch: {
            "publics.gender": { $in: [PublicsGender.women] },
            "publics.administrative": { $in: [PublicsAdministrative.refugee] },
            "publics.familialle": { $in: [PublicsFamily.couple] },
            "publics.other": { $in: [PublicsOther.lgbt] },
          },
        },
      },
    ]);
  });

  it("preserves existing service elemMatch condition and appends audience fields", () => {
    const context = buildContext(
      {
        audiences: {
          admissionPolicy: "open",
          age: 35,
          genders: [PublicsGender.women],
          administrativeStatuses: [],
          familyStatuses: [],
          otherStatuses: [],
        },
      },
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
            "publics.accueil": WelcomedPublics.UNCONDITIONAL,
            "publics.age.min": { $lte: 35 },
            "publics.age.max": { $gte: 35 },
            "publics.gender": { $in: [PublicsGender.women] },
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
});
