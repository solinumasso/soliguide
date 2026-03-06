import { PlaceType } from "@soliguide/common";
import { body } from "express-validator";
import { positionDto } from "./position.dto";
import { infoDto } from "./infos.dto";

export const checkDuplicatesByPlaceDto = [
  body("placeType").isIn(Object.values(PlaceType)),
  ...infoDto(),
  ...positionDto("position."),
];
