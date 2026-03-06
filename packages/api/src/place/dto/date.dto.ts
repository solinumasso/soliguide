import { body } from "express-validator";

import { isValidDate } from "../../_utils/functions/dates/date.functions";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const dateDto = [
  body("date")
    .exists(CHECK_STRING_NULL)
    .custom((value) => isValidDate(value))
    .customSanitizer((value) => {
      return new Date(value);
    }),
];
