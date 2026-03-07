import { body, ValidationChain } from "express-validator";
import {
  EMAIL_NORMALIZE_OPTIONS,
  CHECK_STRING_NULL,
} from "../../config/expressValidator.config";
import { EMAIL_VALIDATOR_CONFIG } from "@soliguide/common";

export const emailValidDtoWithPath = (path = ""): ValidationChain[] => [
  // user email must exist and be an email
  body(path + "mail")
    .exists(CHECK_STRING_NULL)
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),
];

export const emailValidDto = emailValidDtoWithPath();
