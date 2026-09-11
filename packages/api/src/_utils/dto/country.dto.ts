import { body } from "express-validator";
import { SOLIGUIDE_COUNTRIES } from "@soliguide/common";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const countryDto = [
  // `isString` is required before `isIn`: express-validator converts the value to a
  // string first, and that conversion reads only the first element of an array, so
  // `["fr"]` would pass `isIn` and reach Mongoose as an array.
  body("country")
    .exists(CHECK_STRING_NULL)
    .isString()
    .isIn(SOLIGUIDE_COUNTRIES),
];
