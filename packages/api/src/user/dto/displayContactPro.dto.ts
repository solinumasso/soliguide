import { body } from "express-validator";

export const displayContactProDto = [
  body("displayContactPro").exists().isBoolean(),
];
