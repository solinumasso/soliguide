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
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import {
  CountryCodes,
  GeoTypes,
  getDepartmentCodeFromPostalCode,
  LocationAutoCompleteAddress,
  SoliguideCountries,
} from "@soliguide/common";
import { alpha2ToAlpha3, alpha3ToAlpha2 } from "i18n-iso-countries";
import { DepartmentsAndRegionsService } from "../departments-regions.service";
import { ConfigService } from "@nestjs/config";
import type { AxiosResponse } from "axios";
import { firstValueFrom, map } from "rxjs";

import { HereApiAddress } from "../../interfaces";
import {
  HereApiLocalityType,
  HereApiResponse,
  HereApiResultType,
} from "../../types";
import { getGeoValue } from "../get-geo-value";

// https://www.here.com/docs/bundle/geocoding-and-search-api-developer-guide/page/topics/result-types-filter.html
const HERE_API_RESULTS_TYPES = ["address", "city", "area"] as const;

@Injectable()
export class HereApiService {
  constructor(
    public httpService: HttpService,
    public configService: ConfigService,
    public departmentService: DepartmentsAndRegionsService
  ) {}

  async searchForLocation(
    country: CountryCodes,
    search: string,
    latitude?: number,
    longitude?: number
  ) {
    const countryIso = alpha2ToAlpha3(country.toUpperCase());
    const url = "https://geocode.search.hereapi.com/v1/geocode";

    const params: {
      q: string;
      in: string;
      apiKey: string;
      lang: string;
      types: string;
      at?: string;
    } = {
      q: search,
      in: `countryCode:${countryIso}`,
      apiKey: this.configService.get<string>("HERE_API_KEY"),
      lang: "CA",
      types: HERE_API_RESULTS_TYPES.join(","),
    };

    if (latitude & longitude) {
      params.at = `${latitude},${longitude}`;
    }

    return await firstValueFrom(
      this.httpService
        .get<HereApiResponse>(url, { params })
        .pipe(
          map((response: AxiosResponse) =>
            this.getFeatureForAddress(response.data.items)
          )
        )
    );
  }

  private getFeatureForAddress(
    items: HereApiAddress[]
  ): LocationAutoCompleteAddress[] {
    return items
      .filter((item: HereApiAddress) => item?.address.postalCode)
      .map((item: HereApiAddress) => {
        let position: LocationAutoCompleteAddress = {
          label: item.title,
          coordinates: [item.position.lng, item.position.lat],
          postalCode: item?.address?.postalCode,
          cityCode: item?.address?.postalCode,
          city: item?.address?.city,
          name: item.title,
          country: alpha3ToAlpha2(
            item?.address.countryCode
          ).toLowerCase() as SoliguideCountries,
          geoType: this.getGeoTypeForAddress(
            item.resultType,
            item.localityType
          ),
          slugs: {},
          geoValue: "",
        };

        if (position.geoType === GeoTypes.CITY) {
          position.name = item.address.city;
        }

        position.geoValue = getGeoValue(position);

        position.departmentCode = getDepartmentCodeFromPostalCode(
          position.country,
          position.postalCode
        );
        position = this.departmentService.getDepartmentAndRegion(
          position.country,
          position
        );

        return position;
      });
  }

  public getGeoTypeForAddress(
    resultType: HereApiResultType,
    localityType: HereApiLocalityType
  ): GeoTypes {
    if (!["place", "street", "houseNumber"].includes(resultType)) {
      return localityType === "city" || localityType === "postalCode"
        ? GeoTypes.CITY
        : GeoTypes.BOROUGH;
    }

    return GeoTypes.POSITION;
  }

  public async reverse(
    _country: CountryCodes,
    latitude: number,
    longitude: number
  ): Promise<LocationAutoCompleteAddress[]> {
    const hereUrl = "https://geocode.search.hereapi.com/v1/revgeocode" as const;

    const params = {
      at: `${latitude},${longitude}`,
      apiKey: this.configService.get<string>("HERE_API_KEY"),
      lang: "CA", // TODO get from country
      types: HERE_API_RESULTS_TYPES.join(","),
    };
    return await firstValueFrom(
      this.httpService
        .get(hereUrl, { params })
        .pipe(
          map((response: AxiosResponse) =>
            this.getFeatureForAddress(response.data.items)
          )
        )
    );
  }

  // Function used to open a new country, check results
  public async findAddressForNewCountry({
    address,
    country,
    lang,
  }: {
    address: string;
    country: string;
    lang: string;
  }): Promise<LocationAutoCompleteAddress | null> {
    const countryIso = alpha2ToAlpha3(country.toUpperCase());
    const url = "https://geocode.search.hereapi.com/v1/geocode";

    const params: {
      q: string;
      in: string;
      apiKey: string;
      lang: string;
      types: string;
      at?: string;
    } = {
      q: address,
      in: `countryCode:${countryIso}`,
      apiKey: this.configService.get<string>("HERE_API_KEY"),
      lang,
      types: HERE_API_RESULTS_TYPES.join(","),
    };

    return await firstValueFrom(
      this.httpService.get<HereApiResponse>(url, { params }).pipe(
        map((response: AxiosResponse) => {
          if (response.data.items?.length) {
            const item = response.data.items[0];

            const position: LocationAutoCompleteAddress = {
              label: item.title,
              coordinates: [item.position.lng, item.position.lat],
              postalCode: item?.address?.postalCode,
              cityCode: item?.address?.postalCode,
              city: item?.address?.city,
              name: item.title,
              country: alpha3ToAlpha2(
                item?.address.countryCode
              ).toLowerCase() as SoliguideCountries,
              geoType: this.getGeoTypeForAddress(
                item.resultType,
                item.localityType
              ),
              slugs: {},
              geoValue: "",
            };

            if (position.geoType === GeoTypes.CITY) {
              position.name = item.address.city;
            }
            position.geoValue = getGeoValue(position);
            return position;
          }
          return null;
        })
      )
    );
  }
}
