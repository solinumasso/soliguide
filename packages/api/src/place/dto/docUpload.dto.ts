import { check } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const docUploadDto = [
  check("name").exists(CHECK_STRING_NULL).isString().notEmpty(),
  check("serviceId")
    .if((value: any) => value)
    .isInt(),
];
