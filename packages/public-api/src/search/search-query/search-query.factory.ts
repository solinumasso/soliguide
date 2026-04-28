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

import { V20260426SearchRequest } from "../../versions/2026-04-26/2026-04-26.search-request.schema.generated";

import { SearchLocation, SearchQuery } from "./search-query";

type LegacyCompatibleSearchRequest = V20260426SearchRequest & {
  category?: V20260426SearchRequest["categories"][number] | null;
  location?: V20260426SearchRequest["locations"][number] | null;
  updatedByUserAt?: V20260426SearchRequest["updatedAt"] | null;
  word?: string | null;
};

export class SearchQueryFactory {
  create(request: LegacyCompatibleSearchRequest): SearchQuery {
    const categories = this.mapCategories(request);
    const locations = this.mapLocations(request);
    const modalities = this.mapModalities(request.modalities);
    const audiences = this.mapAudiences(request.publics);
    const updatedAt = request.updatedAt ?? request.updatedByUserAt;
    const query: SearchQuery = {
      placeType: request.placeType,
      word: request.q ?? request.word ?? undefined,
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
    const legacyModalities = modalities as typeof modalities & {
      animal?: boolean;
      inconditionnel?: boolean;
      inscription?: boolean;
      orientation?: boolean;
      pmr?: boolean;
      price?: boolean;
      sign?: boolean;
    };
    const unconditional =
      modalities.unconditional ?? legacyModalities.inconditionnel;
    const appointmentRequired =
      modalities.appointmentRequired ?? legacyModalities.appointment;
    const registrationRequired =
      modalities.registrationRequired ?? legacyModalities.inscription;
    const referalRequired =
      modalities.referalRequired ?? legacyModalities.orientation;
    const isAccessible = modalities.isAccessible ?? legacyModalities.pmr;
    const hasFees = modalities.hasFees ?? legacyModalities.price;
    const acceptsPets = modalities.acceptsPets ?? legacyModalities.animal;
    const hasSignLanguage = modalities.hasSignLanguage ?? legacyModalities.sign;

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
    publics: LegacyCompatibleSearchRequest["publics"]
  ): SearchQuery["audiences"] {
    if (!publics) {
      return undefined;
    }

    const legacyPublics = publics as typeof publics & {
      accueil?: WelcomedPublics | null;
      familialle?: PublicsFamily[];
      other?: PublicsOther[];
    };
    const admissionPolicy = this.mapAdmissionPolicy(
      publics.welcomeType ?? legacyPublics.accueil
    );
    const age = this.mapAge(publics.age);
    const genders = publics.gender ?? [];
    const administrativeStatuses = publics.administrative ?? [];
    const familyStatuses = publics.family ?? legacyPublics.familialle ?? [];
    const otherStatuses = publics.specific ?? legacyPublics.other ?? [];

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
