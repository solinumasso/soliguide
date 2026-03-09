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
