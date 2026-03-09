import { body } from "express-validator";

export const forceChangesDto = [
  body("forceChanges")
    .customSanitizer((value) => {
      return value ?? true;
    })
    .isBoolean(),
];
