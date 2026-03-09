import { body } from "express-validator";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import { EMAIL_VALIDATOR_CONFIG } from "@soliguide/common";

export const signinDto = [
  // user email must exist and be an email
  body("mail")
    .exists(CHECK_STRING_NULL)
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),
  // password must be strong enough
  body("password").exists(CHECK_STRING_NULL).notEmpty().isString(),
];
