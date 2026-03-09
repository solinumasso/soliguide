import { PlaceChangesStatus } from "@soliguide/common";
import { body } from "express-validator";

export const patchStatusDto = [
  body("status").if(body("status").isIn(Object.values(PlaceChangesStatus))),
];
