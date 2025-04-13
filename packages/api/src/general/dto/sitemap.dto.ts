import { FR_REGION_CODES, SOLIGUIDE_COUNTRIES } from "@soliguide/common";
import { param } from "express-validator";

export const sitemapDto = [
  param("country").isIn(SOLIGUIDE_COUNTRIES),
  param("regionCode").isIn(FR_REGION_CODES),
];
