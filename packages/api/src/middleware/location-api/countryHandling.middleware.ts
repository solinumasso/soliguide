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

export const locationApiCountryHandling = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  if (
    req.user.isLogged() &&
    req.user.status === UserStatus.API_USER &&
    req.body.location?.geoType === GeoTypes.COUNTRY &&
    /^france$/i.test(req.body.location?.geoValue)
  ) {
    req.body.location.geoValue = CountryCodes.FR;
  }

  if (
    req.user.isLogged() &&
    req.user.status === UserStatus.API_USER &&
    req.body["location.geoType"] === GeoTypes.COUNTRY &&
    /^france$/i.test(req.body["location.geoValue"])
  ) {
    req.body["location.geoValue"] = CountryCodes.FR;
  }

  if (req.body.locations?.length) {
    req.body.locations = req.body.locations.map(
      (location: Partial<GeoPosition>) => {
        if (
          location?.geoType === GeoTypes.COUNTRY &&
          /^france$/i.test(location?.geoValue ?? "")
        ) {
          location.geoValue = CountryCodes.FR;
        }
        return location;
      }
    );
  }

  next();
};
