import { CountryCodes, GeoTypes, PlaceType } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import {
  DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE,
  LocationQueryBuilder,
} from "./place-search.location.query-builder";
import { SearchContext } from "./search.query-builder";

const PLACE_TYPES = [PlaceType.PLACE, PlaceType.ITINERARY] as const;

const getPrefixByPlaceType = (
  placeType: PlaceType
): "position" | "parcours.position" =>
  placeType === PlaceType.ITINERARY ? "parcours.position" : "position";

const buildContext = (
  query: Partial<SearchQuery> = {},
  overrides: Partial<SearchContext> = {}
): SearchContext => ({
  query: query as SearchQuery,
  andConditions: [],
  geoNearStage: null,
  ...overrides,
});

describe("LocationQueryBuilder", () => {
  const builder = new LocationQueryBuilder();

  it("returns the same context when locations is missing", () => {
    const context = buildContext({ word: "food" });

    const result = builder.build(context);

    expect(result).toBe(context);
  });

  it("combines multiple locations with OR conditions", () => {
    const context = buildContext({
      placeType: PlaceType.PLACE,
      locations: [
        { geoType: GeoTypes.COUNTRY, country: CountryCodes.FR },
        { geoType: GeoTypes.COUNTRY, country: CountryCodes.ES },
      ],
    });

    const result = builder.build(context);

    expect(result.andConditions).toEqual([
      {
        $or: [
          { "position.country": CountryCodes.FR },
          { "position.country": CountryCodes.ES },
        ],
      },
    ]);
  });

  it("preserves existing andConditions and appends location condition", () => {
    const context = buildContext(
      {
        placeType: PlaceType.PLACE,
        locations: [{ geoType: GeoTypes.COUNTRY, country: CountryCodes.FR }],
      },
      { andConditions: [{ status: "ONLINE" }] }
    );

    const result = builder.build(context);

    expect(context.andConditions).toEqual([{ status: "ONLINE" }]);
    expect(result.andConditions).toEqual([
      { status: "ONLINE" },
      { "position.country": CountryCodes.FR },
    ]);
    expect(result.geoNearStage).toBeNull();
  });

  it("combines POSITION and non-position locations and keeps geoNear when only one POSITION is provided", () => {
    const context = buildContext({
      placeType: PlaceType.PLACE,
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.3522, 48.8566],
          country: CountryCodes.FR,
        },
        {
          geoType: GeoTypes.CITY,
          city: "Paris",
        },
      ],
    });

    const result = builder.build(context);

    expect(result.geoNearStage).toMatchObject({
      key: "position.location",
      maxDistance: DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE[GeoTypes.POSITION] * 1000,
      near: {
        type: "Point",
        coordinates: [2.3522, 48.8566],
      },
    });
    expect(result.andConditions).toEqual([
      { "position.slugs.city": "paris" },
      { "position.country": CountryCodes.FR },
    ]);
  });

  it.each(PLACE_TYPES)(
    "applies country filter and geoNear stage for %s when using POSITION geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          {
            geoType: GeoTypes.POSITION,
            coordinates: [2.3522, 48.8566],
            distance: 5,
            country: CountryCodes.ES,
          },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          [`${prefix}.country`]: CountryCodes.ES,
        },
      ]);
      expect(result.geoNearStage).toEqual({
        near: {
          type: "Point",
          coordinates: [2.3522, 48.8566],
        },
        distanceField: "distance",
        key: `${prefix}.location`,
        maxDistance: 5000,
        spherical: true,
      });
    }
  );

  it("uses default distance when not provided and using POSITION geoType", () => {
    const context = buildContext({
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.3522, 48.8566],
          country: CountryCodes.FR,
        },
      ],
    });

    const result = builder.build(context);

    expect(result.geoNearStage).toMatchObject({
      maxDistance: DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE[GeoTypes.POSITION] * 1000,
    });
  });

  it("enforces a minimum distance of 1km when using POSITION geoType", () => {
    const context = buildContext({
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.3522, 48.8566],
          distance: 0,
          country: CountryCodes.FR,
        },
      ],
    });

    const result = builder.build(context);

    expect(result.geoNearStage).toMatchObject({
      maxDistance: 1000,
    });
  });

  it.each(PLACE_TYPES)(
    "filters by country for %s when using COUNTRY geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.COUNTRY, country: CountryCodes.AD }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.country`]: CountryCodes.AD },
      ]);
      expect(result.geoNearStage).toBeNull();
    }
  );

  it.each(PLACE_TYPES)(
    "filters by city slug without postal for %s when using CITY geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.CITY, city: "  Saint-Étienne " }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.slugs.city`]: "saint-etienne" },
      ]);
      expect(result.geoNearStage).toBeNull();
    }
  );

  it.each(PLACE_TYPES)(
    "filters by city slug and postal prefix regex for %s when using CITY geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          { geoType: GeoTypes.CITY, city: "paris", postalCode: "75016" },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          [`${prefix}.slugs.city`]: "paris",
          [`${prefix}.postalCode`]: {
            $regex: "^75",
            $options: "i",
          },
        },
      ]);
      expect(result.geoNearStage).toBeNull();
    }
  );

  it.each(PLACE_TYPES)(
    "filters by exact postal code when using plain postal value for %s and using BOROUGH geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.BOROUGH, postalCode: "75016" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.postalCode`]: "75016" },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters by postal code extracted from city-postal format for borough on %s when using BOROUGH geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.BOROUGH, postalCode: "paris-75016" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.postalCode`]: "75016" },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "applies 75216 special mapping for borough on %s",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.BOROUGH, postalCode: "75216" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          [`${prefix}.postalCode`]: {
            $in: ["75116", "75016"],
          },
        },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters by slugified department values for %s when using DEPARTMENT geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          {
            geoType: GeoTypes.DEPARTMENT,
            department: "  Bouches-du-Rhône  ",
          },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.slugs.department`]: "bouches-du-rhone" },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters by slugified region values for %s when using REGION geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.REGION, region: " Île-de-France " }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.slugs.region`]: "ile-de-france" },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters on city, department and region when using CITIES_GROUP geoType for %s",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          { geoType: GeoTypes.CITIES_GROUP, searchText: " Île-de-France " },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          $or: [
            { [`${prefix}.slugs.city`]: "ile-de-france" },
            { [`${prefix}.slugs.department`]: "ile-de-france" },
            { [`${prefix}.slugs.region`]: "ile-de-france" },
          ],
        },
      ]);
      expect(result.geoNearStage).toBeNull();
    }
  );

  it.each(PLACE_TYPES)(
    "normalizes geo-style department values for %s when using DEPARTMENT geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          { geoType: GeoTypes.DEPARTMENT, department: "departement-paris" },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.slugs.department`]: "paris" },
      ]);
      expect(result.geoNearStage).toBeNull();
    }
  );

  it.each(PLACE_TYPES)(
    "filters exact postal code when numeric value is provided on %s and using UNKNOWN geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.UNKNOWN, searchText: "75016" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        { [`${prefix}.postalCode`]: "75016" },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "applies 75216 special mapping for numeric value on %s and using UNKNOWN geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.UNKNOWN, searchText: "75216" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          [`${prefix}.postalCode`]: {
            $in: ["75116", "75016"],
          },
        },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters by city slug and postal regex when value has city-postal format on %s and using UNKNOWN geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [{ geoType: GeoTypes.UNKNOWN, searchText: "paris-75016" }],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          [`${prefix}.slugs.city`]: "paris",
          [`${prefix}.postalCode`]: {
            $regex: "^75",
            $options: "i",
          },
        },
      ]);
    }
  );

  it.each(PLACE_TYPES)(
    "filters on city, department or region when free text is provided on %s and using UNKNOWN geoType",
    (placeType) => {
      const prefix = getPrefixByPlaceType(placeType);
      const context = buildContext({
        placeType,
        locations: [
          { geoType: GeoTypes.UNKNOWN, searchText: " Île-de-France " },
        ],
      });

      const result = builder.build(context);

      expect(result.andConditions).toEqual([
        {
          $or: [
            { [`${prefix}.slugs.city`]: "ile-de-france" },
            { [`${prefix}.slugs.department`]: "ile-de-france" },
            { [`${prefix}.slugs.region`]: "ile-de-france" },
          ],
        },
      ]);
    }
  );
});
