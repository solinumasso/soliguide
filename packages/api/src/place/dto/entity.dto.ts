import { body } from "express-validator";

import { placePhonesDto } from "./phones.dto";

import { checkUrlFieldDto } from "../../_utils/dto";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import { EMAIL_VALIDATOR_CONFIG, REGEXP } from "@soliguide/common";

export const entityDto = [
  // entity.email must be an email
  body("entity.mail")
    .if(body("entity.mail").exists(CHECK_STRING_NULL))
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),

  checkUrlFieldDto("entity.facebook"),
  checkUrlFieldDto("entity.instagram"),
  checkUrlFieldDto("entity.website"),

  // entity.fax must valid french phone number
  body("entity.fax")
    .if((value: any) => value)
    .if(body("entity.fax").matches(REGEXP.phone))
    .trim(),

  ...placePhonesDto("entity.phones.*"),
];
