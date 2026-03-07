import { Phone } from "@soliguide/common";
import { body, ValidationChain } from "express-validator";
import { CHECK_STRING_NULL } from "../../config";
import { checkPhone } from "../../place/dto/phones.dto";

export const commonUserFormDto = (path = ""): ValidationChain[] => [
  body(`${path}name`).isString().trim().notEmpty(),
  body(`${path}lastname`).isString().trim().notEmpty(),
  body(`${path}title`)
    .if((value) => value)
    .isString()
    .trim(),

  body(`${path}phone`)
    .if(body(`${path}phone`).exists(CHECK_STRING_NULL))
    .customSanitizer((phone: Phone) => checkPhone(phone)),
];
