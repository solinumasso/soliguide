import { body } from "express-validator";

import { PlaceType } from "@soliguide/common";

import { entityDto } from "./entity.dto";

import { countryDto, stringDto } from "../../_utils/dto";

export const infoDto = (auto = false) => [
  // Whether the place is automatically inserted
  body("auto").customSanitizer((value) => {
    value = auto;
    return value;
  }),

  // Place name must be between 3 and 250 characters
  body("name").isString().trim().isLength({ max: 250, min: 3 }),

  // Place description must be between 10 and 4000 characters
  stringDto("description", false, 4000, 10),

  // Place type: fixed address or mobile itinerary
  body("placeType")
    .optional()
    .isIn(Object.values(PlaceType))
    .default(PlaceType.PLACE),

  ...countryDto,
  ...entityDto,
];
