import { body } from "express-validator";

export const idsToSyncDto = [
  body("idsToSync").isArray(),
  body("idsToSync.*").isInt(),
];
