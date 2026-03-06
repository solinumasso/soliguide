import { body } from "express-validator";
import {
  COUNTRIES_CALLING_CODES,
  REGEXP,
  phoneUtil,
  type Phone,
} from "@soliguide/common";
import { formatPhoneNumber } from "../../_utils/functions/formatPhoneNumber.functions";

export const commonPhonesDto = (path = "") => [
  body(`${path}.phoneNumber`).exists(),
  body(`${path}.label`)
    .default(null)
    .if((value: any) => value)
    .trim()
    .isLength({ max: 100, min: 3 }),
  body(`${path}.isSpecialPhoneNumber`).isBoolean(),
  body(`${path}.countryCode`).custom((value: string) => {
    if (!value) {
      throw new Error("COUNTRY_IS_REQUIRED");
    }
    const countryCode = value.toLowerCase();
    if (!Object.keys(COUNTRIES_CALLING_CODES).includes(countryCode)) {
      throw new Error("COUNTRY_IS_REQUIRED");
    }
    return countryCode;
  }),
];

export const placePhonesDto = (path = "") => [
  ...commonPhonesDto(path),
  body(path).custom((phone: Phone) => checkPhone(phone)),
];

export const checkPhone = (phone: Phone) => {
  if (!phone.phoneNumber) {
    throw new Error("PHONE_NUMBER_IS_REQUIRED");
  }

  if (!phone.isSpecialPhoneNumber) {
    const parsedValue = phoneUtil.parse(phone.phoneNumber, phone.countryCode);
    if (!phoneUtil.isValidNumber(parsedValue)) {
      throw new Error("PHONE_IS_NOT_VALID");
    }

    phone.phoneNumber = parsedValue.getNationalNumberOrDefault().toString();
  } else if (!REGEXP.phone.exec(phone.phoneNumber)) {
    throw new Error("CUSTOM_PHONE_IS_NOT_VALID");
  } else {
    phone.phoneNumber = formatPhoneNumber(phone.phoneNumber) ?? "";
  }
  return phone;
};
