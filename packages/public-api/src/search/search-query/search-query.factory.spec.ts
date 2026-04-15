import {
  Categories,
  GeoTypes,
  PlaceType,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  UpdatedAtInterval,
  WelcomedPublics,
} from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { V20260101SearchRequest } from "../../versions/2026-01-01/2026-01-01.search-request.schema.generated";
import { SearchQueryFactory } from "./search-query.factory";

describe("SearchQueryFactory", () => {
  const factory = new SearchQueryFactory();

  it("maps category alias to categories when categories is missing", () => {
    const result = factory.create(
      buildRequest({
        category: Categories.DOMICILIATION,
      })
    );

    expect(result.categories).toEqual([Categories.DOMICILIATION]);
  });

  it("keeps categories when categories and category are both provided", () => {
    const result = factory.create(
      buildRequest({
        category: Categories.DOMICILIATION,
        categories: [Categories.FOOD_DISTRIBUTION],
      })
    );

    expect(result.categories).toEqual([Categories.FOOD_DISTRIBUTION]);
  });

  it("maps single location to locations when locations is missing", () => {
    const result = factory.create(buildRequest());

    expect(result.locations).toEqual([
      {
        geoType: GeoTypes.POSITION,
        coordinates: [2.35, 48.85],
        country: "FR",
      },
    ]);
  });

  it.each([
    {
      location: {
        geoType: GeoTypes.COUNTRY,
        geoValue: "FR",
      },
      expected: {
        geoType: GeoTypes.COUNTRY,
        country: "FR",
      },
    },
    {
      location: {
        geoType: GeoTypes.CITY,
        geoValue: "paris-75015",
      },
      expected: {
        geoType: GeoTypes.CITY,
        city: "paris",
        postalCode: "75015",
      },
    },
    {
      location: {
        geoType: GeoTypes.BOROUGH,
        geoValue: "paris-75015",
      },
      expected: {
        geoType: GeoTypes.BOROUGH,
        postalCode: "75015",
      },
    },
    {
      location: {
        geoType: GeoTypes.DEPARTMENT,
        geoValue: "departement-seine-saint-denis",
      },
      expected: {
        geoType: GeoTypes.DEPARTMENT,
        department: "seine-saint-denis",
      },
    },
    {
      location: {
        geoType: GeoTypes.REGION,
        geoValue: "region-ile-de-france",
      },
      expected: {
        geoType: GeoTypes.REGION,
        region: "ile-de-france",
      },
    },
    {
      location: {
        geoType: GeoTypes.CITIES_GROUP,
        geoValue: "metropole-lille",
      },
      expected: {
        geoType: GeoTypes.CITIES_GROUP,
        searchText: "metropole-lille",
      },
    },
    {
      location: {
        geoType: GeoTypes.UNKNOWN,
        geoValue: "75011",
      },
      expected: {
        geoType: GeoTypes.UNKNOWN,
        searchText: "75011",
      },
    },
  ])("maps location %j to internal query shape", ({ location, expected }) => {
    const result = factory.create(
      buildRequest({
        location: location as V20260101SearchRequest["location"],
      })
    );

    expect(result.locations).toEqual([expected]);
  });

  it("maps modalities request keys to internal modality keys", () => {
    const result = factory.create(
      buildRequest({
        modalities: {
          animal: true,
          appointment: true,
          inconditionnel: false,
          inscription: true,
          orientation: false,
          pmr: true,
          price: false,
          sign: true,
        },
      })
    );

    expect(result.modalities).toEqual({
      acceptsPets: true,
      isAppointmentRequired: true,
      isUnconditional: false,
      isRegistrationRequired: true,
      isOrientationRequired: false,
      hasWeelchairAccess: true,
      isPaid: false,
      sign: true,
    });
  });

  it("maps publics to audiences", () => {
    const result = factory.create(
      buildRequest({
        publics: {
          accueil: WelcomedPublics.PREFERENTIAL,
          age: { min: 12, max: 35 },
          gender: [PublicsGender.women],
          administrative: [PublicsAdministrative.refugee],
          familialle: [PublicsFamily.couple],
          other: [PublicsOther.lgbt],
        },
      })
    );

    expect(result.audiences).toEqual({
      admissionPolicy: "restricted",
      age: 35,
      genders: [PublicsGender.women],
      administrativeStatuses: [PublicsAdministrative.refugee],
      familyStatuses: [PublicsFamily.couple],
      otherStatuses: [PublicsOther.lgbt],
    });
  });

  it("uses updatedByUserAt when updatedAt is not provided", () => {
    const legacyUpdatedAt = {
      intervalType: UpdatedAtInterval.AFTER_DAY,
      value: new Date("2026-01-01"),
    };

    const result = factory.create({
      ...buildRequest({
        updatedAt: null,
      }),
      updatedByUserAt: legacyUpdatedAt,
    } as V20260101SearchRequest & {
      updatedByUserAt: V20260101SearchRequest["updatedAt"];
    });

    expect(result.updatedAt).toEqual(legacyUpdatedAt);
  });

  it("maps languages as scalar value", () => {
    const result = factory.create(
      buildRequest({
        languages: "fr",
      })
    );

    expect(result.languages).toBe("fr");
  });

  it("returns a clean query without request-only keys", () => {
    const result = factory.create(
      buildRequest({
        category: Categories.DOMICILIATION,
        publics: {
          accueil: WelcomedPublics.UNCONDITIONAL,
          age: { min: 18 },
          gender: [],
          administrative: [],
          familialle: [],
          other: [],
        },
      })
    ) as Record<string, unknown>;

    expect(result.category).toBeUndefined();
    expect(result.publics).toBeUndefined();
    expect(result.location).toBeUndefined();
    expect(result.categories).toEqual([Categories.DOMICILIATION]);
    expect(result.audiences).toBeDefined();
  });
});

function buildRequest(
  overrides: Partial<V20260101SearchRequest> = {}
): V20260101SearchRequest {
  return {
    placeType: PlaceType.PLACE,
    location: {
      geoType: GeoTypes.POSITION,
      coordinates: [2.35, 48.85],
      country: "FR",
    },
    ...overrides,
  } as V20260101SearchRequest;
}
