import { PlaceVisibility } from "@soliguide/common";

import { body } from "express-validator";
import { forceChangesDto } from "./forceChanges.dto";

export const visibilityDto = [
  body("visibility").exists().isIn(Object.values(PlaceVisibility)),
  ...forceChangesDto,
];
