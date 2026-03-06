import { SortingOrder } from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const searchOptionsDto = [
  body("options.sortValue")
    .if(body("options.sortValue").exists(CHECK_STRING_NULL))
    .isNumeric()
    .isIn(Object.values(SortingOrder)),

  body("options.page")
    .if(body("options.page").exists(CHECK_STRING_NULL))
    .isNumeric()
    .toInt(),

  body("options.limit")
    .if(body("options.limit").exists(CHECK_STRING_NULL))
    .isNumeric()
    .toInt(),

  body("options.fields")
    .if((value: string) => value.trim())
    .trim(),
];
