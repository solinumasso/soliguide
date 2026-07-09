import {
  CountryCodes,
  extractGeoTypeFromSearch,
  GeoTypes,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  WelcomedPublics,
} from "@soliguide/common";
import { Categories, SoliguideCountries } from "@soliguide/common";

import { CanonicalSearchRequest } from "../canonical-search-request";
import { SearchLocation, SearchQuery } from "./search-query";

export class SearchQueryFactory {
  create(request: CanonicalSearchRequest): SearchQuery {
    const categories = this.mapCategories(request);
    const locations = this.mapLocations(request);
    const modalities = this.mapModalities(request.modalities);
    const audiences = this.mapAudiences(request.publics);
    const query: SearchQuery = {
      placeType: request.placeType,
      word: request.q ?? undefined,
      openToday:
        typeof request.openToday === "boolean" ? request.openToday : undefined,
      languages: request.languages ?? undefined,
      widgetId: request.widgetId ?? undefined,
      options: request.options ?? undefined,
    };

    if (categories?.length) {
      query.categories = categories;
    }

    if (locations?.length) {
      query.locations = locations;
    }

    if (modalities) {
      query.modalities = modalities;
    }

    if (audiences) {
      query.audiences = audiences;
    }

    if (request.updatedAt) {
      query.updatedAt = request.updatedAt;
    }

    return query;
  }

  private mapCategories(
    request: CanonicalSearchRequest
  ): Categories[] | undefined {
    if (request.categories?.length) {
      return [...request.categories];
    }

    const category = (
      request as CanonicalSearchRequest & {
        category?: Categories;
      }
    ).category;

    return category ? [category] : undefined;
  }

  private mapLocations(
    request: CanonicalSearchRequest
  ): SearchLocation[] | undefined {
    const requestLocations = request.locations ?? [];

    if (!requestLocations.length) {
      return undefined;
    }

    const mappedLocations: SearchLocation[] = [];

    for (const location of requestLocations) {
      const mappedLocation = this.mapLocation(location);
      if (mappedLocation) {
        mappedLocations.push(mappedLocation);
      }
    }

    return mappedLocations.length ? mappedLocations : undefined;
  }

  private mapLocation(
    location: CanonicalSearchLocation
  ): SearchLocation | null {
    const geoFields = this.mapGeoFields(location);

    if (location.geoType === GeoTypes.POSITION) {
      return {
        geoType: GeoTypes.POSITION,
        coordinates: location.coordinates as [number, number],
        distance:
          typeof location.distance === "number" ? location.distance : undefined,
        country: geoFields.country ?? CountryCodes.FR,
      };
    }

    const geoValue = this.cleanGeoValue(location.geoValue);
    if (!geoValue) {
      return null;
    }

    switch (location.geoType) {
      case GeoTypes.COUNTRY:
        return {
          geoType: GeoTypes.COUNTRY,
          country: geoValue as CountryCodes,
        };
      case GeoTypes.CITY:
        return {
          ...geoFields,
          ...this.mapCityLocation(geoValue),
        };
      case GeoTypes.BOROUGH:
        return {
          ...geoFields,
          geoType: GeoTypes.BOROUGH,
          postalCode: this.extractPostalCode(geoValue),
        };
      case GeoTypes.DEPARTMENT:
        return {
          ...geoFields,
          ...this.mapDepartmentLocation(geoValue, location.country),
        };
      case GeoTypes.REGION:
        return {
          ...geoFields,
          ...this.mapRegionLocation(geoValue, location.country),
        };
      case GeoTypes.CITIES_GROUP:
        return {
          ...geoFields,
          geoType: GeoTypes.CITIES_GROUP,
          searchText: geoValue,
        };
      case GeoTypes.UNKNOWN:
        return {
          ...geoFields,
          geoType: GeoTypes.UNKNOWN,
          searchText: geoValue,
        };
      default:
        return null;
    }
  }

  private mapGeoFields(location: CanonicalSearchLocation): {
    coordinates?: [number, number];
    distance?: number;
    country?: CountryCodes;
  } {
    const geoFields: {
      coordinates?: [number, number];
      distance?: number;
      country?: CountryCodes;
    } = {};

    if (location.coordinates?.length === 2) {
      geoFields.coordinates = location.coordinates as [number, number];
    }

    if (typeof location.distance === "number") {
      geoFields.distance = location.distance;
    }

    if (location.country) {
      geoFields.country = location.country as CountryCodes;
    }

    return geoFields;
  }

  private mapCityLocation(geoValue: string): SearchLocation {
    const cityParts = geoValue.split(/-(?=\d)/);
    const city = cityParts[0];
    const postalCode = cityParts[1];

    return {
      geoType: GeoTypes.CITY,
      city,
      postalCode: postalCode ?? undefined,
    };
  }

  private mapDepartmentLocation(
    geoValue: string,
    country: string | null | undefined
  ): SearchLocation {
    const extracted = extractGeoTypeFromSearch(
      geoValue,
      (country ?? CountryCodes.FR) as SoliguideCountries
    );
    return {
      geoType: GeoTypes.DEPARTMENT,
      department: extracted.search,
    };
  }

  private mapRegionLocation(
    geoValue: string,
    country: string | null | undefined
  ): SearchLocation {
    const extracted = extractGeoTypeFromSearch(
      geoValue,
      (country ?? CountryCodes.FR) as SoliguideCountries
    );
    return {
      geoType: GeoTypes.REGION,
      region: extracted.search,
    };
  }

  private extractPostalCode(geoValue: string): string {
    const [, maybePostalCode] = geoValue.split("-");

    return maybePostalCode || geoValue;
  }

  private cleanGeoValue(value?: string | null): string | null {
    const cleanedValue = value?.trim();

    if (!cleanedValue) {
      return null;
    }

    return cleanedValue;
  }

  private mapModalities(
    modalities: CanonicalSearchRequest["modalities"]
  ): SearchQuery["modalities"] {
    if (!modalities) {
      return undefined;
    }

    const mappedModalities: SearchQuery["modalities"] = {};
    const unconditional = modalities.unconditional;
    const appointmentRequired = modalities.appointmentRequired;
    const registrationRequired = modalities.registrationRequired;
    const referalRequired = modalities.referalRequired;
    const isAccessible = modalities.isAccessible;
    const hasFees = modalities.hasFees;
    const acceptsPets = modalities.acceptsPets;
    const hasSignLanguage = modalities.hasSignLanguage;

    if (typeof unconditional === "boolean") {
      mappedModalities.isUnconditional = unconditional;
    }

    if (typeof appointmentRequired === "boolean") {
      mappedModalities.isAppointmentRequired = appointmentRequired;
    }

    if (typeof registrationRequired === "boolean") {
      mappedModalities.isRegistrationRequired = registrationRequired;
    }

    if (typeof referalRequired === "boolean") {
      mappedModalities.isOrientationRequired = referalRequired;
    }

    if (typeof isAccessible === "boolean") {
      mappedModalities.hasWeelchairAccess = isAccessible;
    }

    if (typeof hasFees === "boolean") {
      mappedModalities.isPaid = hasFees;
    }

    if (typeof acceptsPets === "boolean") {
      mappedModalities.acceptsPets = acceptsPets;
    }

    if (typeof hasSignLanguage === "boolean") {
      mappedModalities.sign = hasSignLanguage;
    }

    return Object.keys(mappedModalities).length ? mappedModalities : undefined;
  }

  private mapAudiences(
    publics: CanonicalSearchRequest["publics"]
  ): SearchQuery["audiences"] {
    if (!publics) {
      return undefined;
    }

    const admissionPolicy = this.mapAdmissionPolicy(publics.welcomeType);
    const age = this.mapAge(publics.age);
    const genders = publics.gender ?? [];
    const administrativeStatuses = publics.administrative ?? [];
    const familyStatuses = publics.family ?? [];
    const otherStatuses = publics.specific ?? [];

    if (
      !admissionPolicy &&
      typeof age !== "number" &&
      !genders.length &&
      !administrativeStatuses.length &&
      !familyStatuses.length &&
      !otherStatuses.length
    ) {
      return undefined;
    }

    return {
      admissionPolicy,
      age,
      genders: genders as PublicsGender[],
      administrativeStatuses: administrativeStatuses as PublicsAdministrative[],
      familyStatuses: familyStatuses as PublicsFamily[],
      otherStatuses: otherStatuses as PublicsOther[],
    };
  }

  private mapAdmissionPolicy(
    welcomeType?: WelcomedPublics | null
  ): "open" | "restricted" | "targeted" | undefined {
    if (welcomeType === WelcomedPublics.UNCONDITIONAL) {
      return "open";
    }

    if (welcomeType === WelcomedPublics.PREFERENTIAL) {
      return "restricted";
    }

    if (welcomeType === WelcomedPublics.EXCLUSIVE) {
      return "targeted";
    }

    return undefined;
  }

  private mapAge(
    age?: { min?: number | null; max?: number | null } | null
  ): number | undefined {
    if (!age) {
      return undefined;
    }

    if (typeof age.max === "number") {
      return age.max;
    }

    if (typeof age.min === "number") {
      return age.min;
    }

    return undefined;
  }
}

type CanonicalSearchLocation = NonNullable<
  CanonicalSearchRequest["locations"]
>[number];
