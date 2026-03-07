import { body } from "express-validator";

export const booleanDto = (path: string) => body(path).isBoolean().toBoolean();
