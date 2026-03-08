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
