import { CommonOpeningHours, PlaceType } from "@soliguide/common";

import mongoose from "mongoose";
import { body } from "express-validator";
import { positionDto } from "./position.dto";
import { isValidHoursObject } from "../../_utils/hours-custom.functions";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const parcoursDto = [
  ...positionDto("*.position."),

  body("*.description")
    .if((value: any) => value)
    .exists(CHECK_STRING_NULL)
    .isString()
    .trim()
    .isLength({ max: 100, min: 1 }),

  body("*.hours")
    .custom((hours) => isValidHoursObject(hours, PlaceType.ITINERARY))
    .customSanitizer((hours) => new CommonOpeningHours(hours)),

  body("*.photos")
    .isArray()
    .customSanitizer((photos: any[]) => {
      if (!photos?.length) {
        return [];
      }
      return photos.map((photo) => {
        photo._id = new mongoose.Types.ObjectId(photo._id);
        return photo;
      });
    }),
];
