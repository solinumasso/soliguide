import { body } from "express-validator";

import { stringDto } from "../../_utils/dto";

const checkCoordinate = (coordinate: string) =>
  body(coordinate)
    .if((value: string) => value)
    .isFloat({ min: -90, max: 90 });

export const formatAddressDto = [
  stringDto("address", false),
  stringDto("city", false),
  stringDto("postal_code", false),
  checkCoordinate("latitude"),
  checkCoordinate("longitude"),
];
