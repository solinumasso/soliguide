import {
  slugString,
  SOLIGUIDE_COUNTRIES,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";
import { body, param } from "express-validator";
import { CHECK_STRING_NULL } from "../../config";

export const textSearchDto = (key: string) => {
  return [
    body(key)
      .if(body(key).exists(CHECK_STRING_NULL))
      .isString()
      .trim()
      .escape()
      .customSanitizer((string: string) => slugString(string)),
  ];
};

export const searchSuggestionDto = (key: string) => {
  return [
    param("lang").if(body("lang").exists()).isIn(SUPPORTED_LANGUAGES),
    param("country").exists(CHECK_STRING_NULL).isIn(SOLIGUIDE_COUNTRIES),
    param(key)
      .stripLow()
      .blacklist("<>&\"'=(){}[];")
      .trim()
      .isLength({ min: 2, max: 100 })
      .notEmpty()
      .escape(),
  ];
};
