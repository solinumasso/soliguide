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
import type { SoliguideCountries } from "@soliguide/common";

import { V20260101SearchRequest } from "../../versions/2026-01-01/2026-01-01.search-request.schema.generated";

import { SearchLocation, SearchQuery } from "./search-query";

type LegacyCompatibleSearchRequest = V20260101SearchRequest & {
  updatedByUserAt?: V20260101SearchRequest["updatedAt"] | null;
};

export class SearchQueryFactory {
  create(request: LegacyCompatibleSearchRequest): SearchQuery {
    const categories = this.mapCategories(request);
    const locations = this.mapLocations(request);
    const modalities = this.mapModalities(request.modalities);
    const audiences = this.mapAudiences(request.publics);
    const updatedAt = request.updatedAt ?? request.updatedByUserAt;
    const requestQuery = request as unknown as Partial<SearchQuery>;
    const query: SearchQuery = {
      placeType: request.placeType,
      word: request.word ?? undefined,
      openToday:
        typeof request.openToday === "boolean" ? request.openToday : undefined,
      languages: request.languages ?? undefined,
      widgetId: request.widgetId ?? undefined,
      options: request.options ?? undefined,
      status: requestQuery.status,
      visibility: requestQuery.visibility,
      serviceFiltersEnabled: requestQuery.serviceFiltersEnabled,
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

    if (updatedAt) {
      query.updatedAt = updatedAt;
    }

    return query;
  }

  private mapCategories(
    request: LegacyCompatibleSearchRequest
  ): SearchQuery["categories"] {
    if (request.categories?.length) {
      return [...request.categories];
    }

    if (request.category) {
      return [request.category];
    }

    return undefined;
  }

  private mapLocations(
    request: LegacyCompatibleSearchRequest
  ): SearchQuery["locations"] {
    const requestLocations = request.locations?.length
      ? request.locations
      : request.location
      ? [request.location]
      : [];

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
    location: NonNullable<LegacyCompatibleSearchRequest["location"]>
  ): SearchLocation | null {
    if (location.geoType === GeoTypes.POSITION) {
      return {
        geoType: GeoTypes.POSITION,
        coordinates: location.coordinates as [number, number],
        distance:
          typeof location.distance === "number" ? location.distance : undefined,
        country: location.country ?? CountryCodes.FR,
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
        return this.mapCityLocation(geoValue);
      case GeoTypes.BOROUGH:
        return {
          geoType: GeoTypes.BOROUGH,
          postalCode: this.extractPostalCode(geoValue),
        };
      case GeoTypes.DEPARTMENT:
        return this.mapDepartmentLocation(geoValue, location.country);
      case GeoTypes.REGION:
        return this.mapRegionLocation(geoValue, location.country);
      case GeoTypes.CITIES_GROUP:
        return {
          geoType: GeoTypes.CITIES_GROUP,
          searchText: geoValue,
        };
      case GeoTypes.UNKNOWN:
        return {
          geoType: GeoTypes.UNKNOWN,
          searchText: geoValue,
        };
      default:
        return null;
    }
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
    country: string | undefined
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
    country: string | undefined
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
    modalities: LegacyCompatibleSearchRequest["modalities"]
  ): SearchQuery["modalities"] {
    if (!modalities) {
      return undefined;
    }

    const mappedModalities: SearchQuery["modalities"] = {};

    if (typeof modalities.inconditionnel === "boolean") {
      mappedModalities.isUnconditional = modalities.inconditionnel;
    }

    if (typeof modalities.appointment === "boolean") {
      mappedModalities.isAppointmentRequired = modalities.appointment;
    }

    if (typeof modalities.inscription === "boolean") {
      mappedModalities.isRegistrationRequired = modalities.inscription;
    }

    if (typeof modalities.orientation === "boolean") {
      mappedModalities.isOrientationRequired = modalities.orientation;
    }

    if (typeof modalities.pmr === "boolean") {
      mappedModalities.hasWeelchairAccess = modalities.pmr;
    }

    if (typeof modalities.price === "boolean") {
      mappedModalities.isPaid = modalities.price;
    }

    if (typeof modalities.animal === "boolean") {
      mappedModalities.acceptsPets = modalities.animal;
    }

    if (typeof modalities.sign === "boolean") {
      mappedModalities.sign = modalities.sign;
    }

    return Object.keys(mappedModalities).length ? mappedModalities : undefined;
  }

  private mapAudiences(
    publics: LegacyCompatibleSearchRequest["publics"]
  ): SearchQuery["audiences"] {
    if (!publics) {
      return undefined;
    }

    const admissionPolicy = this.mapAdmissionPolicy(publics.accueil);
    const age = this.mapAge(publics.age);
    const genders = publics.gender ?? [];
    const administrativeStatuses = publics.administrative ?? [];
    const familyStatuses = publics.familialle ?? [];
    const otherStatuses = publics.other ?? [];

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
    accueil?: WelcomedPublics | null
  ): "open" | "restricted" | "targeted" | undefined {
    if (accueil === WelcomedPublics.UNCONDITIONAL) {
      return "open";
    }

    if (accueil === WelcomedPublics.PREFERENTIAL) {
      return "restricted";
    }

    if (accueil === WelcomedPublics.EXCLUSIVE) {
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
