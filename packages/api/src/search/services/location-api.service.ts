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
import axios from "axios";

import {
  type CountryCodes,
  type GeoTypes,
  type LocationAutoCompleteAddress,
  slugLocation,
} from "@soliguide/common";

import { CONFIG } from "../../_models";

class LocationApiService {
  public locationApiEndPoint: string;

  constructor() {
    this.locationApiEndPoint = CONFIG.SOLIGUIDE_LOCATION_API_URL;
  }

  async reverse(
    latitude: number,
    longitude: number,
    throwIfNoAddress = true
  ): Promise<LocationAutoCompleteAddress | null> {
    // TODO: update this url when we start international integration
    const apiResponse = await axios.get<LocationAutoCompleteAddress[]>(
      `${this.locationApiEndPoint}/reverse/fr/${latitude}/${longitude}`
    );

    if (apiResponse.data.length === 0) {
      if (throwIfNoAddress) {
        throw new Error("CANNOT_GET_POSITION_FROM_COORDINATES");
      }
      return null;
    }
    return apiResponse.data[0];
  }

  async getAddress({
    country,
    geoValue,
    throwIfNoAddress,
    lat,
    lon,
    geoType,
  }: {
    country: CountryCodes;
    geoValue: string;
    throwIfNoAddress: boolean;
    lat?: number;
    lon?: number;
    geoType?: GeoTypes;
  }): Promise<LocationAutoCompleteAddress[] | null> {
    const baseUrl = `${
      this.locationApiEndPoint
    }/autocomplete/${country}/all/${encodeURI(slugLocation(geoValue))}`;

    const params: {
      latitude?: number;
      longitude?: number;
      geoType?: GeoTypes;
    } = {};

    if (lat && lon) {
      params.latitude = lat;
      params.longitude = lon;
    }

    if (geoType) {
      params.geoType = geoType;
    }

    const apiResponse = await axios.get<LocationAutoCompleteAddress[]>(
      baseUrl,
      { params }
    );

    if (apiResponse.data.length === 0) {
      if (throwIfNoAddress) {
        throw new Error("CANNOT_GET_POSITION_FROM_ADDRESS");
      }
      return null;
    }
    return apiResponse.data;
  }
}

export default new LocationApiService();
