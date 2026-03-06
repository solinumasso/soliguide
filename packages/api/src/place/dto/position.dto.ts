import { CountryCodes } from "@soliguide/common";
import { body } from "express-validator";

import { stringDto } from "../../_utils/dto";

export const coordinatesDto = (path = "") => [
  body(path).isArray(),
  body(`${path}.*`)
    .isFloat()
    .custom((value) => {
      return value > -90 && value < 90;
    }),
];

export const postalCodeDto = (path = "") =>
  body(path).isString().trim().toUpperCase();

export const positionDto = (path = "") => [
  stringDto(`${path}address`),
  stringDto(`${path}additionalInformation`, false, 300),
  stringDto(`${path}country`, false),
  stringDto(`${path}city`),
  postalCodeDto(`${path}postalCode`),
  stringDto(`${path}cityCode`, false),
  stringDto(`${path}department`),
  stringDto(`${path}regionCode`),
  stringDto(`${path}departmentCode`),
  stringDto(`${path}region`),
  stringDto(`${path}timeZone`, false),
  body(`${path}country`).exists().isIn(Object.values(CountryCodes)),
  body(`${path}location.type`)
    .if((value: any) => value)
    .isString(),
  ...coordinatesDto(`${path}location.coordinates`),
];
