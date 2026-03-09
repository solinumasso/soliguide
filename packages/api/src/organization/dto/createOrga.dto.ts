import { body } from "express-validator";

import { territoriesDto, checkUrlFieldDto } from "../../_utils/dto";
import { formatPhoneNumber } from "../../_utils/functions/formatPhoneNumber.functions";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import {
  EMAIL_VALIDATOR_CONFIG,
  Phone,
  REGEXP,
  RELATIONS,
} from "@soliguide/common";
import { checkPhone } from "../../place/dto/phones.dto";

export const baseEditOrganizationDto = [
  body("name")
    .exists(CHECK_STRING_NULL)
    .isLength({ max: 200 })
    .isString()
    .trim(),

  body("description")
    .if(body("description").exists(CHECK_STRING_NULL))
    .isLength({ max: 4000, min: 10 })
    .isString()
    .trim(),

  body("mail")
    .if(body("mail").exists(CHECK_STRING_NULL))
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),

  body("phone")
    .if(body("phone").exists(CHECK_STRING_NULL))
    .custom((phone: Phone) => checkPhone(phone)),

  body("fax")
    .if(body("fax").exists(CHECK_STRING_NULL))
    .trim()
    .matches(REGEXP.phone)
    .customSanitizer((value) => formatPhoneNumber(value)),

  checkUrlFieldDto("facebook"),
  checkUrlFieldDto("website"),

  body("relations")
    // TODO to remove once territories admin would have fill out the relationships
    .if(body("relations").notEmpty())
    .notEmpty()
    .isArray()
    .custom((relations) => {
      for (const relation of relations) {
        if (!RELATIONS.includes(relation)) {
          throw new Error("WRONG_RELATION");
        }
      }
      return true;
    }),
];

export const orgaDto = [...baseEditOrganizationDto, ...territoriesDto];
