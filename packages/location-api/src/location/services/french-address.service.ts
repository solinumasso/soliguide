/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { FrenchAddress } from "../sources/FR/interfaces/FrenchAddress.interface";

import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import {
  CountryCodes,
  DEPARTMENTS_MAP,
  FR_BOROUGHS,
  FR_BOROUGHS_CITY_CODES,
  GeoTypes,
  LocationAutoCompleteAddress,
  PositionSlugs,
  getDepartmentCodeFromPostalCode,
  getTimeZoneFromPosition,
  slugLocation,
} from "@soliguide/common";

import { ConfigService } from "@nestjs/config";
import { AxiosError, AxiosResponse } from "axios";
import { Feature, Point } from "geojson";
import { join } from "path";
import { catchError, firstValueFrom, map, retry } from "rxjs";
import {
  FrenchApiPoiResponse,
  FrenchAutocompleteParams,
  FrenchPoi,
} from "../sources/FR/interfaces";
import { PoiCategory } from "../sources/FR/types";
import { isLatLong } from "class-validator";
import { getGeoValue } from ".";

const ADDRESS_MINIMAL_SCORE = 0.4;
const SORT_ORDER = [GeoTypes.CITY, GeoTypes.BOROUGH, GeoTypes.POSITION];

@Injectable()
export class FrenchAddressService {
  private readonly logger = new Logger(FrenchAddressService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async searchForLocation(
    _country: CountryCodes,
    search: string,
    latitude?: number,
    longitude?: number
  ) {
    search = this.normalizeGeoValueSearch(search);

    const params: FrenchAutocompleteParams = this.getParams(
      search,
      latitude,
      longitude
    );

    if (params.q?.length < 3) {
      // French api needs 3 characters
      return [];
    }

    const url = join(
      this.configService.get<string>("FRENCH_ADDRESS_API_URL"),
      "search"
    );

    return await firstValueFrom(
      this.httpService.get<FrenchApiPoiResponse>(url, { params }).pipe(
        retry(2),
        map((response: AxiosResponse<FrenchApiPoiResponse>) => {
          return this.getAddressFromFeatures(response);
        }),
        catchError((error: AxiosError) => {
          this.logger.error({ url, params, error });
          throw new Error("CANNOT_GET_ADDRESS_OR_CITY_FROM_STRING");
        })
      )
    );
  }

  public async reverse(
    _country: CountryCodes,
    latitude: number,
    longitude: number
  ): Promise<LocationAutoCompleteAddress[]> {
    const url = join(
      this.configService.get<string>("FRENCH_ADDRESS_API_URL"),
      "reverse/"
    );

    const params: FrenchAutocompleteParams = {
      lon: longitude,
      lat: latitude,
      limit: 10,
      index: "address",
      type: "housenumber",
    };

    return await firstValueFrom(
      this.httpService.get<FrenchApiPoiResponse>(url, { params }).pipe(
        retry(2),
        map((response: AxiosResponse<FrenchApiPoiResponse>) => {
          return this.getAddressFromFeatures(response);
        }),
        catchError((error: AxiosError) => {
          this.logger.error({ url, params, error });
          throw new Error("CANNOT_GET_ADDRESS_OR_CITY_FROM_LOCATION");
        })
      )
    );
  }

  private getAddressFromFeatures(
    response: AxiosResponse<FrenchApiPoiResponse>
  ): LocationAutoCompleteAddress[] {
    const features = response.data.features
      .filter((feature: Feature<Point, FrenchAddress & FrenchPoi>) => {
        if (typeof feature.properties?.category !== "undefined") {
          // Filter boroughs
          const categoriesToCheck: PoiCategory[] = [
            "arrondissement municipal",
            "zone d'habitation",
            "région",
            "département",
            "aérodrome",
            "epci",
          ];
          return feature.properties?.category.every(
            (category: PoiCategory) => !categoriesToCheck.includes(category)
          );
        }
        // We delete the elements with too low a score
        return feature.properties.score >= ADDRESS_MINIMAL_SCORE;
      })
      .filter((feature: Feature<Point, FrenchAddress | FrenchPoi>) => {
        return (
          feature.properties?.citycode?.length ||
          feature.properties?.postcode?.length
        );
      })
      .map((feature: Feature<Point, FrenchAddress | FrenchPoi>) => {
        return typeof feature.properties.type !== "undefined"
          ? this.getFeatureForAddress(feature as Feature<Point, FrenchAddress>)
          : this.getFeatureForPoi(feature as Feature<Point, FrenchPoi>);
      })
      .filter(
        (location: LocationAutoCompleteAddress) =>
          location.postalCode && location.postalCode !== ""
      )
      .sort(
        (a: LocationAutoCompleteAddress, b: LocationAutoCompleteAddress) => {
          const aIndex = SORT_ORDER.indexOf(a.geoType);
          const bIndex = SORT_ORDER.indexOf(b.geoType);

          if (aIndex === bIndex) {
            return 0;
          }
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }
      );

    return this.filterDuplicates(features);
  }

  private getFeatureForAddress(
    feature: Feature<Point, FrenchAddress>
  ): LocationAutoCompleteAddress {
    let position: LocationAutoCompleteAddress = {
      label: feature.properties.label,
      coordinates: feature.geometry.coordinates,
      postalCode: feature.properties.postcode,
      cityCode: feature.properties.citycode,
      city: feature.properties?.city,
      name: feature.properties?.name,
      country: CountryCodes.FR,
      geoType: this.getGeoTypeForAddress(feature),
      slugs: {},
      geoValue: "",
    };

    // Delete "Xeme arrondissement"
    if (position.geoType === GeoTypes.BOROUGH) {
      position.city = position.city.split(" ")[0];
    }

    position = this.getDepartmentAndRegion(position);
    position.label = this.getLabel(position);
    position.geoValue = getGeoValue(position);

    return position;
  }

  private getFeatureForPoi(
    feature: Feature<Point, FrenchPoi>
  ): LocationAutoCompleteAddress {
    const geoType = this.getGeoTypeForPoi(feature);
    const name = this.getPoiElement(feature.properties.name);

    const city =
      geoType !== GeoTypes.CITY
        ? this.getPoiElement(feature.properties.city)
        : name;

    const postalCode = this.getPoiElement(feature.properties.postcode);

    let position: LocationAutoCompleteAddress = {
      label: name,
      coordinates: feature.geometry.coordinates,
      postalCode,
      cityCode: this.getPoiElement(feature.properties.citycode),
      city,
      country: CountryCodes.FR,
      name,
      geoType,
      geoValue: "",
      slugs: {},
    };

    position = this.getDepartmentAndRegion(position);
    position.label = this.getLabel(position);
    position.geoValue = getGeoValue(position);
    return position;
  }

  public getGeoTypeForAddress(
    feature: Feature<Point, FrenchAddress>
  ): GeoTypes {
    if (feature.properties.type === "municipality") {
      // Check for Marseille, Paris, Lyon
      if (FR_BOROUGHS_CITY_CODES.indexOf(feature.properties.citycode) !== -1) {
        return GeoTypes.CITY;
      }

      return FR_BOROUGHS.indexOf(feature.properties.postcode.toString()) === -1
        ? GeoTypes.CITY
        : GeoTypes.BOROUGH;
    }

    return GeoTypes.POSITION;
  }

  public getParams(
    search: string,
    latitude?: number,
    longitude?: number
  ): FrenchAutocompleteParams {
    const params: FrenchAutocompleteParams = {
      q: search,
      limit: 5,
      index: "poi,address",
    };

    if (latitude || longitude) {
      if (!isLatLong(`${latitude},${longitude}`)) {
        throw new Error("WRONG_LATITUDE_LONGITUDE");
      }
      params.lat = latitude;
      params.lon = longitude;
    }
    return params;
  }

  private getGeoTypeForPoi(feature: Feature<Point, FrenchPoi>): GeoTypes {
    if (feature.properties.category.indexOf("département") !== -1) {
      return GeoTypes.DEPARTMENT;
    } else if (feature.properties.category.indexOf("région") !== -1) {
      return GeoTypes.REGION;
    } else if (feature.properties.category.indexOf("commune") !== -1) {
      return GeoTypes.CITY;
    }
    return GeoTypes.POSITION;
  }

  private getDepartmentAndRegion(
    position: LocationAutoCompleteAddress
  ): LocationAutoCompleteAddress {
    if (position?.geoType === GeoTypes.REGION) {
      position.postalCode = undefined;
      position.city = undefined;
      position.cityCode = undefined;
      position.department = undefined;
      position.departmentCode = undefined;
    } else if (position?.geoType === GeoTypes.DEPARTMENT) {
      position.city = undefined;
      position.cityCode = undefined;
      position.postalCode = undefined;
    } else if (position?.cityCode) {
      position.departmentCode = getDepartmentCodeFromPostalCode(
        CountryCodes.FR,
        position.cityCode
      );
    } else if (position?.postalCode) {
      position.departmentCode = getDepartmentCodeFromPostalCode(
        CountryCodes.FR,
        position.postalCode
      );
    }

    if (position?.departmentCode) {
      position.department =
        DEPARTMENTS_MAP[CountryCodes.FR][
          position.departmentCode
        ].departmentName;
      position.region =
        DEPARTMENTS_MAP[CountryCodes.FR][position.departmentCode].regionName;
      position.regionCode =
        DEPARTMENTS_MAP[CountryCodes.FR][position.departmentCode].regionCode;
    }

    position.timeZone = getTimeZoneFromPosition(position);
    position.slugs = new PositionSlugs(position);
    return position;
  }

  private getLabel(position: LocationAutoCompleteAddress) {
    let label = `${position.name}, ${position.postalCode} ${position.city}`;

    if (position.geoType === GeoTypes.CITY) {
      label = `${position.city} (${position.postalCode})`;
    } else if (position.geoType === GeoTypes.BOROUGH) {
      label = `${position.name}`;
    } else if (position.geoType === GeoTypes.DEPARTMENT) {
      label = `${position.department} (${position.departmentCode})`;
    } else if (position.geoType === GeoTypes.REGION) {
      label = `${position.region}`;
    }
    return this.cleanStr(label);
  }

  private getPoiElement(str?: string[]): string {
    return str?.length > 0 ? str[0] : "";
  }

  private cleanStr(str?: string): string {
    return str ? str.trim().replace(/\s+/g, " ") : "";
  }

  private filterDuplicates(
    locations: LocationAutoCompleteAddress[]
  ): LocationAutoCompleteAddress[] {
    const uniqueLocations = new Map<string, LocationAutoCompleteAddress>();

    for (const location of locations) {
      const key = `${slugLocation(location.label)}-${
        location.cityCode
      }-${slugLocation(location.geoType)}`;
      if (!uniqueLocations.has(key)) {
        uniqueLocations.set(key, location);
      }
    }

    return Array.from(uniqueLocations.values());
  }

  /**
   * Convert the old search by district with a new format for Paris, Marseille and Lyon
   * ex: paris-75001 => 75001-paris
   */
  public normalizeGeoValueSearch(search: string): string {
    const CITY_POSTAL_REGEX = /^(.+)\s+(\d{5})$/i;
    const match = search.match(CITY_POSTAL_REGEX);
    if (!match) return search;

    const city = match[1].trim();
    const postal = match[2].trim();

    const SPECIAL_CITIES = new Set(["paris", "marseille", "lyon"]);
    if (SPECIAL_CITIES.has(city.toLowerCase())) {
      return `${postal} ${city}`;
    }

    return search;
  }
}
