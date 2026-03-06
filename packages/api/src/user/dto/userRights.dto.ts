import { body } from "express-validator";

import { USER_ROLES } from "../constants/USER_ROLES.const";

export const userRightsDto = [
  body("role").notEmpty().isIn(USER_ROLES),
  // TODO: check if it's an array of numbers
  body("places").exists().isArray(),
  body("isInvitation").exists().isBoolean().toBoolean(),
];
