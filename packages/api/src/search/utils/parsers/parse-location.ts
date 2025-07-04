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
import { FilterQuery, RootQuerySelector } from "mongoose";

import {
  GeoTypes,
  getDepartmentCodeFromPostalCode,
  PlaceType,
  slugLocation,
  UserStatus,
  getDefaultSearchRadiusByGeoType,
  ApiPlace,
  CountryCodes,
  getAllowedTerritories,
  GeoPosition,
  extractGeoTypeFromSearch,
} from "@soliguide/common";
import { UserForSearch } from "../../../user/types";

const parseDepartmentFromPostalCode = (
  geoValue: string
): {
  $regex: string;
  $options: "i";
} => {
  const postalCode = geoValue
    .split(/^[a-z-]+/)[1] // ["", "postal-code"]
    .toString()
    .trim()
    .toUpperCase();

  return {
    $regex: `^${postalCode.substring(0, 2)}`,
    $options: "i",
  };
};

const parsePostalCode = (
  postalCode: string,
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserForSearch,
  onItinerary = false
): void => {
  postalCode = postalCode.toString().trim().toUpperCase();

  const postalCodeSplitted = postalCode.split("-");
  if (postalCodeSplitted.length > 1) {
    postalCode = postalCodeSplitted[1];
  }

  let postalCodeToSearch: FilterQuery<ApiPlace> | string | null = null;

  if (
    user.status !== UserStatus.API_USER ||
    !user.territories.length ||
    user.territories.includes(
      getDepartmentCodeFromPostalCode(CountryCodes.FR, postalCode)
    )
  ) {
    postalCodeToSearch =
      postalCode === "75216" ? { $in: ["75116", "75016"] } : postalCode;

    if (onItinerary) {
      nosqlQuery["parcours"]["$elemMatch"]["position.postalCode"] =
        postalCodeToSearch;
    } else {
      nosqlQuery["position.postalCode"] = postalCodeToSearch;
    }
  }
};

const parseLocationWithGeoNearOnly = (
  location: GeoPosition,
  nosqlQuery: RootQuerySelector<ApiPlace>,
  geoType: GeoTypes,
  placeType: PlaceType = PlaceType.PLACE
) => {
  if (!location.distance) {
    location.distance = getDefaultSearchRadiusByGeoType(geoType);
  } else if (typeof location.distance === "string") {
    const parsedDistance = parseInt(location.distance, 10);
    if (isNaN(parsedDistance)) {
      throw new Error("Invalid distance value:", location.distance);
    }
    location.distance = parsedDistance;
  }

  location.distance = location.distance * 1000;

  const key =
    placeType === PlaceType.PLACE
      ? "position.country"
      : "parcours.position.country";

  const countryToSearch =
    location?.country ?? location?.areas?.country ?? CountryCodes.FR;
  nosqlQuery[key] = countryToSearch;

  if (location.coordinates?.length) {
    nosqlQuery.$geoNear = {
      distanceField: "distance",
      key:
        placeType === PlaceType.PLACE
          ? "position.location"
          : "parcours.position.location",
      maxDistance: location.distance,
      near: {
        coordinates: location.coordinates,
        type: "Point",
      },
    };
  }
};

export const parseLocation = (
  location: GeoPosition,
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserForSearch,
  admin = false
): void => {
  const countryToSearch =
    location?.country ?? location?.areas?.country ?? CountryCodes.FR;

  if (!location?.geoType) {
    throw new Error("GEOTYPE_IS_REQUIRED");
  }

  const geoType = location.geoType;

  if (
    geoType === GeoTypes.POSITION ||
    (geoType !== GeoTypes.COUNTRY &&
      !admin &&
      user.status !== UserStatus.WIDGET_USER &&
      user.status !== UserStatus.API_USER)
  ) {
    parseLocationWithGeoNearOnly(location, nosqlQuery, geoType);
    return;
  }

  if (!location.geoValue) {
    if (
      user.status === UserStatus.ADMIN_TERRITORY ||
      user.status === UserStatus.ADMIN_SOLIGUIDE ||
      user.status === UserStatus.API_USER
    ) {
      const allowedTerritories = getAllowedTerritories(user, countryToSearch);
      nosqlQuery["position.departmentCode"] = {
        $in: allowedTerritories,
      };
    } else {
      throw new Error("parseLocation GEOVALUE_IS_REQUIRED");
    }

    return;
  }

  const geoValue = location.geoValue;

  if (geoType === GeoTypes.BOROUGH) {
    parsePostalCode(geoValue, nosqlQuery, user);
  } else if (geoType === GeoTypes.COUNTRY) {
    nosqlQuery["position.country"] = geoValue;
  } else if (geoType === GeoTypes.CITY) {
    const city = geoValue.split(/-\d/); // ["city-name", ""] if postal code exists on the geoValue, ["city-name"] otherwise
    nosqlQuery["position.slugs.city"] = slugLocation(city[0]);

    if (city.length > 1) {
      nosqlQuery["position.postalCode"] =
        parseDepartmentFromPostalCode(geoValue);
    }
  }
  // Departments / Regions
  else if (geoType === GeoTypes.REGION || geoType === GeoTypes.DEPARTMENT) {
    const cleanedSearch = extractGeoTypeFromSearch(
      location?.geoValue,
      countryToSearch
    );

    nosqlQuery[`position.slugs.${cleanedSearch.geoType ?? location?.geoType}`] =
      cleanedSearch.search;
  } else if (geoType === GeoTypes.UNKNOWN) {
    if (/^\d+$/.test(geoValue)) {
      parsePostalCode(geoValue, nosqlQuery, user);
    } else {
      // If it's a city name with a postal code, we remove the city.
      // Otherwise we don't know what we're looking at, so we search for anything
      const values = geoValue.split(/-\d/);

      if (values.length > 1) {
        const city = values[0];

        nosqlQuery["position.slugs.city"] = slugLocation(city);
        nosqlQuery["position.postalCode"] =
          parseDepartmentFromPostalCode(geoValue);
      } else {
        nosqlQuery["$and"] = [
          {
            $or: [
              { "position.slugs.department": slugLocation(geoValue) },
              { "position.slugs.region": slugLocation(geoValue) },
              { "position.slugs.city": slugLocation(geoValue) },
            ],
          },
        ];
      }
    }
  }

  if (user.status !== UserStatus.API_USER) {
    nosqlQuery["position.country"] = countryToSearch;
  }
};

export const parseLocationParcours = (
  location: GeoPosition,
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserForSearch,
  admin = false
) => {
  const countryToSearch =
    location?.country ?? location?.areas?.country ?? CountryCodes.FR;

  if (!location?.geoType) {
    throw new Error("parseLocationParcours: GEOTYPE_IS_REQUIRED");
  }
  const geoType = location.geoType;

  if (
    geoType === GeoTypes.POSITION ||
    (!admin &&
      user.status !== UserStatus.API_USER &&
      (geoType === GeoTypes.BOROUGH || geoType === GeoTypes.CITY))
  ) {
    parseLocationWithGeoNearOnly(
      location,
      nosqlQuery,
      geoType,
      PlaceType.ITINERARY
    );
  } else if (location.geoValue) {
    const geoValue = location.geoValue;

    nosqlQuery["parcours"] = { $elemMatch: {} };

    if (geoType === GeoTypes.BOROUGH) {
      parsePostalCode(geoValue, nosqlQuery, user, true);
    } else if (geoType === GeoTypes.CITY) {
      const city = geoValue.split(/-\d/); // ["city-name", ""] if postal code exists on the geoValue, ["city-name"] otherwise

      nosqlQuery["parcours"]["$elemMatch"]["position.slugs.city"] =
        slugLocation(city[0]);

      if (city.length > 1) {
        nosqlQuery["parcours"]["$elemMatch"]["position.postalCode"] =
          parseDepartmentFromPostalCode(geoValue);
      }
    } else if (geoType === GeoTypes.COUNTRY) {
      nosqlQuery["parcours"]["$elemMatch"]["position.country"] = geoValue;
    } else if (geoType === GeoTypes.REGION || geoType === GeoTypes.DEPARTMENT) {
      const cleanedSearch = extractGeoTypeFromSearch(
        location?.geoValue,
        countryToSearch
      );
      nosqlQuery["parcours"]["$elemMatch"][
        `position.slugs.${cleanedSearch.geoType ?? location?.geoType}`
      ] = cleanedSearch.search;
    } else if (geoType === GeoTypes.UNKNOWN) {
      if (/^\d+$/.test(geoValue)) {
        parsePostalCode(geoValue, nosqlQuery, user, true);
      } else {
        const values = geoValue.split(/-\d/);

        if (values.length > 1) {
          const city = values[0];

          nosqlQuery["parcours"]["$elemMatch"]["position.slugs.city"] =
            slugLocation(city);
          nosqlQuery["parcours"]["$elemMatch"]["position.postalCode"] =
            parseDepartmentFromPostalCode(geoValue);
        } else {
          delete nosqlQuery.parcours;

          nosqlQuery["$and"] = [
            {
              $or: [
                {
                  parcours: {
                    $elemMatch: {
                      "position.slugs.department": slugLocation(
                        location.geoValue
                      ),
                    },
                  },
                },
                {
                  parcours: {
                    $elemMatch: {
                      "position.slugs.region": slugLocation(location.geoValue),
                    },
                  },
                },
                {
                  parcours: {
                    $elemMatch: {
                      "position.slugs.city": slugLocation(location.geoValue),
                    },
                  },
                },
              ],
            },
          ];
        }
      }
    }
  }
};
