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

import type { CanonicalSearchRequest } from "../canonical-search-request";
import { SearchQueryFactory } from "./search-query.factory";

type CanonicalSearchLocation =
  NonNullable<CanonicalSearchRequest["locations"]>[number];

describe("SearchQueryFactory", () => {
  const factory = new SearchQueryFactory();

  it("maps categories", () => {
    const result = factory.create(
      buildRequest({
        categories: [Categories.DOMICILIATION],
      })
    );

    expect(result.categories).toEqual([Categories.DOMICILIATION]);
  });

  it("maps q to internal word", () => {
    const result = factory.create(
      buildRequest({
        q: "repas",
      })
    );

    expect(result.word).toBe("repas");
  });

  it("maps locations", () => {
    const result = factory.create(buildRequest());

    expect(result.locations).toEqual([
      {
        geoType: GeoTypes.POSITION,
        coordinates: [2.35, 48.85],
        country: "FR",
      },
    ]);
  });

  it("keeps geo fields on non-position locations", () => {
    const result = factory.create(
      buildRequest({
        locations: [
          {
            geoType: GeoTypes.CITY,
            geoValue: "paris-75015",
            coordinates: [2.35, 48.85],
            distance: 15,
            country: "FR",
          },
        ],
      })
    );

    expect(result.locations).toEqual([
      {
        geoType: GeoTypes.CITY,
        city: "paris",
        postalCode: "75015",
        coordinates: [2.35, 48.85],
        distance: 15,
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
        locations: [location as CanonicalSearchLocation],
      })
    );

    expect(result.locations).toEqual([expected]);
  });

  it("maps modalities request keys to internal modality keys", () => {
    const result = factory.create(
      buildRequest({
        modalities: {
          acceptsPets: true,
          appointmentRequired: true,
          unconditional: false,
          registrationRequired: true,
          referalRequired: false,
          isAccessible: true,
          hasFees: false,
          hasSignLanguage: true,
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
          welcomeType: WelcomedPublics.PREFERENTIAL,
          age: { min: 12, max: 35 },
          gender: [PublicsGender.women],
          administrative: [PublicsAdministrative.refugee],
          family: [PublicsFamily.couple],
          specific: [PublicsOther.lgbt],
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

  it("maps updatedAt", () => {
    const updatedAt = {
      intervalType: UpdatedAtInterval.AFTER_DAY,
      value: new Date("2026-01-01"),
    };

    const result = factory.create(
      buildRequest({
        updatedAt,
      })
    );

    expect(result.updatedAt).toEqual(updatedAt);
  });

  it("maps languages", () => {
    const result = factory.create(
      buildRequest({
        languages: ["fr"],
      })
    );

    expect(result.languages).toEqual(["fr"]);
  });

  it("returns a clean query without request-only keys", () => {
    const result = factory.create(
      buildRequest({
        categories: [Categories.DOMICILIATION],
        publics: {
          welcomeType: WelcomedPublics.UNCONDITIONAL,
          age: { min: 18 },
          gender: [],
          administrative: [],
          family: [],
          specific: [],
        },
      })
    ) as Record<string, unknown>;

    expect(result.publics).toBeUndefined();
    expect(result.locations).toEqual([
      {
        geoType: GeoTypes.POSITION,
        coordinates: [2.35, 48.85],
        country: "FR",
      },
    ]);
    expect(result.categories).toEqual([Categories.DOMICILIATION]);
    expect(result.audiences).toBeDefined();
  });
});

function buildRequest(
  overrides: Partial<CanonicalSearchRequest> = {}
): CanonicalSearchRequest {
  return {
    placeType: PlaceType.PLACE,
    locations: [
      {
        geoType: GeoTypes.POSITION,
        coordinates: [2.35, 48.85],
        country: "FR",
      },
    ],
    ...overrides,
  } as CanonicalSearchRequest;
}
