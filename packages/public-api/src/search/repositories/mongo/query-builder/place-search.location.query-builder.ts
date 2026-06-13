import { Injectable } from "@nestjs/common";
import { type Document } from "mongodb";

import { GeoTypes, PlaceType } from "@soliguide/common";

import {
  PositionSearchLocation,
  SearchLocation,
} from "../../../search-query/search-query";
import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { appendAndConditions } from "./utils";

@Injectable()
export class LocationQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const queryLocations = context.query.locations;

    if (!queryLocations?.length) {
      return context;
    }

    const placeType = context.query.placeType ?? PlaceType.PLACE;

    const geoNearCandidateLocations: PositionSearchLocation[] = [];
    for (const location of queryLocations) {
      if (location.geoType === GeoTypes.POSITION && location.coordinates) {
        geoNearCandidateLocations.push(location as PositionSearchLocation);
      }
    }

    // Important: $geoNear can only appear once. If exactly one POSITION location
    // is provided, we keep geoNear and still combine all location filters.
    const positionLocation =
      geoNearCandidateLocations.length === 1
        ? geoNearCandidateLocations[0]
        : null;

    const locationConditions: Document[] = [];
    for (const location of queryLocations) {
      if (positionLocation && location === positionLocation) {
        continue;
      }

      if (location.geoType === GeoTypes.POSITION && location.coordinates) {
        locationConditions.push(
          this.buildPositionCountryCondition(location, placeType)
        );
        continue;
      }

      const locationCondition = this.buildLocationCondition(
        location,
        placeType
      );
      if (locationCondition) {
        locationConditions.push(locationCondition);
      }
    }

    if (!locationConditions.length) {
      if (!positionLocation) {
        return context;
      }

      return this.withGeoNear(context, placeType, positionLocation);
    }

    const locationCondition =
      locationConditions.length === 1
        ? locationConditions[0]
        : { $or: locationConditions };

    const nextContext = appendAndConditions(context, locationCondition);

    if (!positionLocation) {
      return nextContext;
    }

    return this.withGeoNear(nextContext, placeType, positionLocation);
  }

  private withGeoNear(
    context: SearchContext,
    placeType: PlaceType,
    location: PositionSearchLocation
  ): SearchContext {
    const country = location.country;

    const distanceKilometers =
      typeof location.distance === "number"
        ? location.distance
        : this.getDefaultRadiusInKilometers(location.geoType);

    return {
      ...context,
      andConditions: [
        ...context.andConditions,
        {
          [LOCATION_COUNTRY_BY_PLACE_TYPE[placeType]]: country,
        },
      ],
      geoNearStage: {
        near: {
          type: "Point",
          coordinates: location.coordinates as [number, number],
        },
        distanceField: "distance",
        key: LOCATION_GEO_KEY_BY_PLACE_TYPE[placeType],
        maxDistance: Math.max(1, distanceKilometers) * 1000,
        spherical: true,
      },
    };
  }

  private getDefaultRadiusInKilometers(geoType?: string): number {
    if (
      !geoType ||
      !Object.prototype.hasOwnProperty.call(
        DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE,
        geoType
      )
    ) {
      return DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE[GeoTypes.UNKNOWN];
    }

    return DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE[geoType];
  }

  private buildPositionCountryCondition(
    location: PositionSearchLocation,
    placeType: PlaceType
  ): Document {
    return {
      [LOCATION_COUNTRY_BY_PLACE_TYPE[placeType]]: location.country,
    };
  }

  private buildLocationCondition(
    location: SearchLocation,
    placeType: PlaceType
  ): Document | null {
    const prefix = this.getPrefixByPlaceType(placeType);

    switch (location.geoType) {
      case GeoTypes.COUNTRY:
        return this.buildCountryCondition(location, prefix);
      case GeoTypes.CITY:
        return this.buildCityCondition(location, prefix);
      case GeoTypes.BOROUGH:
        return this.buildBoroughCondition(location, prefix);
      case GeoTypes.DEPARTMENT:
        return this.buildDepartmentCondition(location, prefix);
      case GeoTypes.REGION:
        return this.buildRegionCondition(location, prefix);
      case GeoTypes.CITIES_GROUP:
        return this.buildCitiesGroupCondition(location, prefix);
      case GeoTypes.UNKNOWN:
        return this.buildUnknownCondition(location, prefix);
      default:
        return null;
    }
  }

  private getPrefixByPlaceType(placeType: PlaceType): string {
    return placeType === PlaceType.ITINERARY ? "parcours.position" : "position";
  }

  private buildCountryCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.COUNTRY }>,
    prefix: string
  ): Document {
    return { [`${prefix}.country`]: location.country };
  }

  private buildCityCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.CITY }>,
    prefix: string
  ): Document | null {
    const city = location.city?.trim();
    if (!city) {
      return null;
    }

    const condition: Document = {
      [`${prefix}.slugs.city`]: this.slugifyLocation(city),
    };

    const postalCodePrefix = this.extractPostalCodePrefix(location.postalCode);
    if (postalCodePrefix) {
      condition[`${prefix}.postalCode`] = {
        $regex: `^${postalCodePrefix}`,
        $options: "i",
      };
    }

    return condition;
  }

  private buildBoroughCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.BOROUGH }>,
    prefix: string
  ): Document {
    return {
      [`${prefix}.postalCode`]: this.buildPostalCodeCondition(
        location.postalCode
      ),
    };
  }

  private buildDepartmentCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.DEPARTMENT }>,
    prefix: string
  ): Document | null {
    const department = location.department?.trim();
    if (!department) {
      return null;
    }

    return {
      [`${prefix}.slugs.department`]: this.normalizeDepartmentSlug(department),
    };
  }

  private buildRegionCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.REGION }>,
    prefix: string
  ): Document | null {
    const region = location.region?.trim();
    if (!region) {
      return null;
    }

    return { [`${prefix}.slugs.region`]: this.slugifyLocation(region) };
  }

  private buildCitiesGroupCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.CITIES_GROUP }>,
    prefix: string
  ): Document | null {
    const searchText = location.searchText?.trim();
    if (!searchText) {
      return null;
    }

    return this.buildSlugOrCondition(searchText, prefix);
  }

  private buildUnknownCondition(
    location: Extract<SearchLocation, { geoType: GeoTypes.UNKNOWN }>,
    prefix: string
  ): Document | null {
    if (!location.searchText?.trim()) {
      return null;
    }

    const searchText = location.searchText.trim();

    if (/^\d+$/.test(searchText)) {
      return {
        [`${prefix}.postalCode`]: this.buildPostalCodeCondition(searchText),
      };
    }

    if (/-\d/.test(searchText)) {
      const [city] = searchText.split(/-\d/);
      const postalCodePrefix = this.extractPostalCodePrefix(searchText);

      if (postalCodePrefix) {
        return {
          [`${prefix}.slugs.city`]: this.slugifyLocation(city),
          [`${prefix}.postalCode`]: {
            $regex: `^${postalCodePrefix}`,
            $options: "i",
          },
        };
      }
    }

    return this.buildSlugOrCondition(searchText, prefix);
  }

  private buildSlugOrCondition(searchText: string, prefix: string): Document {
    const slug = this.slugifyLocation(searchText);

    return {
      $or: [
        { [`${prefix}.slugs.city`]: slug },
        { [`${prefix}.slugs.department`]: slug },
        { [`${prefix}.slugs.region`]: slug },
      ],
    };
  }

  private buildPostalCodeCondition(
    rawPostalCode: string
  ): string | { $in: string[] } {
    const postalCode = this.extractPostalCode(rawPostalCode);

    if (postalCode === "75216") {
      return { $in: ["75116", "75016"] };
    }

    return postalCode;
  }

  private extractPostalCode(rawGeoValue: string): string {
    const normalizedValue = rawGeoValue.trim().toUpperCase();
    const [, maybePostalCode] = normalizedValue.split("-");

    return maybePostalCode || normalizedValue;
  }

  private extractPostalCodePrefix(postalCode?: string): string | null {
    if (!postalCode?.trim()) {
      return null;
    }

    const normalizedPostalCode = postalCode.trim().toUpperCase();
    const extractedPostalCode = normalizedPostalCode.includes("-")
      ? normalizedPostalCode.split("-")[1]
      : normalizedPostalCode;

    if (!extractedPostalCode) {
      return null;
    }

    return extractedPostalCode.substring(0, 2);
  }

  private slugifyLocation(value: string): string {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private normalizeDepartmentSlug(value: string): string {
    return this.slugifyLocation(value).replace(
      /^(?:departement|department)-/,
      ""
    );
  }
}

export const DEFAULT_SEARCH_RADIUS_BY_GEO_TYPE: Record<string, number> = {
  [GeoTypes.BOROUGH]: 20,
  [GeoTypes.CITIES_GROUP]: 30,
  [GeoTypes.CITY]: 20,
  [GeoTypes.COUNTRY]: 500,
  [GeoTypes.DEPARTMENT]: 80,
  [GeoTypes.POSITION]: 10,
  [GeoTypes.REGION]: 120,
  [GeoTypes.UNKNOWN]: 20,
};

export const LOCATION_COUNTRY_BY_PLACE_TYPE: Record<PlaceType, string> = {
  [PlaceType.PLACE]: "position.country",
  [PlaceType.ITINERARY]: "parcours.position.country",
};

export const LOCATION_GEO_KEY_BY_PLACE_TYPE: Record<PlaceType, string> = {
  [PlaceType.PLACE]: "position.location",
  [PlaceType.ITINERARY]: "parcours.position.location",
};
