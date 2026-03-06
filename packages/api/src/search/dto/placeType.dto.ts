import { body } from "express-validator";
import { PlaceType } from "@soliguide/common";

export const placeTypeDto = [
  body("placeType")
    .customSanitizer((value) => {
      if (!value) {
        return PlaceType.PLACE;
      }
      return value;
    })
    .isIn(Object.values(PlaceType)),
];
