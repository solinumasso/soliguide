import { body } from "express-validator";
import { placeTypeDto } from "./placeType.dto";

export const lookupDto = [
  body("ids").exists().bail().isArray({ min: 1 }),
  body("ids.*").isInt({ min: 1 }),

  ...placeTypeDto,
];
