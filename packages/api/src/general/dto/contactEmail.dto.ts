import {
  ALL_DEPARTMENT_CODES,
  EMAIL_VALIDATOR_CONFIG,
  KeyStringValueString,
} from "@soliguide/common";

import { body } from "express-validator";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import { countryDto } from "../../_utils/dto";

const VALID_DEPARTMENT_CODES: string[] = [...ALL_DEPARTMENT_CODES, "99"];

export const contactEmailDto = [
  body("name")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .escape(),

  body("email")
    .exists(CHECK_STRING_NULL)
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),

  ...countryDto,

  body("department")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .isString()
    .isIn(VALID_DEPARTMENT_CODES)
    .withMessage("Veuillez vérifier que vous avez bien choisi un département"),

  body("subject")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .escape()
    .customSanitizer((value: string) => {
      const map: KeyStringValueString = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      };
      return value.replace(/[&<>]/g, (stringToEscape) => {
        return map[stringToEscape];
      });
    }),

  body("message")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .customSanitizer((value: string) => {
      const map: KeyStringValueString = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      };
      return value.replace(/[&<>]/g, (stringToEscape) => {
        return map[stringToEscape];
      });
    }),
];
