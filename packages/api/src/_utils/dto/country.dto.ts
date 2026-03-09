import { body } from "express-validator";
import { SOLIGUIDE_COUNTRIES } from "@soliguide/common";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const countryDto = [
  body("country").exists(CHECK_STRING_NULL).isIn(SOLIGUIDE_COUNTRIES),
];
