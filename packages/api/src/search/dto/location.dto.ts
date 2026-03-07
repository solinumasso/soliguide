import { param } from "express-validator";
import { CHECK_STRING_NULL } from "../../config";
import { GeoTypes } from "@soliguide/common";

export const locationDto = [
  param("geoType").exists(CHECK_STRING_NULL).isIn(Object.values(GeoTypes)),
  param("text").exists(CHECK_STRING_NULL).isString(),
];
