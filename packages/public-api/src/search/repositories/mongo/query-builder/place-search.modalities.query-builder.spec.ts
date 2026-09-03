import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { ModalitiesQueryBuilder } from "./place-search.modalities.query-builder";
import { SearchContext } from "./search.query-builder";

describe("ModalitiesQueryBuilder", () => {
  const builder = new ModalitiesQueryBuilder();

  const buildContext = (
    query: Partial<SearchQuery> = {},
    overrides: Partial<SearchContext> = {}
  ): SearchContext => ({
    query: query as SearchQuery,
    andConditions: [],
    geoNearStage: null,
    ...overrides,
  });

  it("returns unchanged context when modalities are missing", () => {
    const context = buildContext({ word: "food" });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when modalities has no boolean values", () => {
    const context = buildContext({
      modalities: {
        isUnconditional: undefined as unknown as boolean,
        sign: undefined,
      } as SearchQuery["modalities"],
    });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("returns unchanged context when modalities are provided but no service condition exists", () => {
    const context = buildContext({
      modalities: {
        isUnconditional: true,
      },
    });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("maps all supported modality filters", () => {
    const context = buildContext(
      {
        modalities: {
          isUnconditional: true,
          acceptsPets: true,
          isAppointmentRequired: true,
          isRegistrationRequired: false,
          isOrientationRequired: true,
          hasWeelchairAccess: false,
          isPaid: true,
          sign: false,
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
            "modalities.inconditionnel": true,
            "modalities.animal.checked": true,
            "modalities.appointment.checked": true,
            "modalities.inscription.checked": false,
            "modalities.orientation.checked": true,
            "modalities.pmr.checked": false,
            "modalities.price.checked": true,
            "modalities.sign.checked": false,
          },
        },
      },
    ]);
  });

  it("preserves existing service elemMatch condition and appends modalities fields", () => {
    const context = buildContext(
      {
        modalities: {
          isUnconditional: false,
          isPaid: true,
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
            "modalities.inconditionnel": false,
            "modalities.price.checked": true,
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

  it("overwrites existing modality keys in service elemMatch condition", () => {
    const context = buildContext(
      {
        modalities: {
          isUnconditional: false,
          isOrientationRequired: true,
        },
      },
      {
        andConditions: [
          {
            services_all: {
              $elemMatch: {
                "modalities.inconditionnel": true,
                "modalities.orientation.checked": false,
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
            "modalities.inconditionnel": false,
            "modalities.orientation.checked": true,
          },
        },
      },
    ]);
  });
});
