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

import {
  CountryCodes,
  GeoPosition,
  GeoTypes,
  UserStatus,
} from "@soliguide/common";
import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "src/_models";

const FRANCE_PATTERN = /^france$/i;

const isSafeKey = (key: string): boolean => {
  return (
    !key.includes("__proto__") &&
    !key.includes("constructor") &&
    !key.includes("prototype")
  );
};

const getCountryFromUserAreas = (user: any): string | undefined => {
  const areas = user?.areas || [];
  const areaWithDepartments = areas.find(
    (area: any) =>
      area?.departments &&
      Array.isArray(area.departments) &&
      area.departments.length > 0
  );
  return areaWithDepartments?.country;
};

const normalizeCountryLocation = (
  location: Partial<GeoPosition>,
  userCountry?: string
): void => {
  if (!location || typeof location !== "object") return;

  if (
    location?.geoType === GeoTypes.COUNTRY &&
    FRANCE_PATTERN.test(location?.geoValue ?? "")
  ) {
    location.geoValue = CountryCodes.FR;
  } else if (
    location?.geoType === GeoTypes.COUNTRY &&
    !location?.geoValue &&
    userCountry
  ) {
    location.geoValue = userCountry;
  }
};

const isApiUser = (user: any): boolean => {
  return user.isLogged() && user.status === UserStatus.API_USER;
};

export const locationApiCountryHandling = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  if (!isApiUser(req.user) || typeof req.body !== "object") {
    return next();
  }

  const userCountry = getCountryFromUserAreas(req.user);

  if (
    req.body.location &&
    typeof req.body.location === "object" &&
    isSafeKey("location")
  ) {
    normalizeCountryLocation(req.body.location, userCountry);
  }

  if (
    isSafeKey("location.geoType") &&
    isSafeKey("location.geoValue") &&
    req.body["location.geoType"] === GeoTypes.COUNTRY &&
    typeof req.body["location.geoValue"] === "string" &&
    FRANCE_PATTERN.test(req.body["location.geoValue"])
  ) {
    req.body["location.geoValue"] = CountryCodes.FR;
  }

  if (Array.isArray(req.body.locations) && isSafeKey("locations")) {
    req.body.locations.forEach((loc: Partial<GeoPosition>) => {
      if (typeof loc === "object") {
        normalizeCountryLocation(loc, userCountry);
      }
    });
  }

  next();
};
