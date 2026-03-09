import { body } from "express-validator";
import { htmlTagSanitizerAndLengthCheck } from "../functions";

export const stringDto = (path = "", required = true, max = 10000, min = 1) =>
  body(path)
    .if((value: string) => value || required)
    .isString()
    .trim()
    .custom((value: string) => htmlTagSanitizerAndLengthCheck(value, min, max));
