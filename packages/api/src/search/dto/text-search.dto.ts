import { slugString } from "@soliguide/common";
import { body } from "express-validator";
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
