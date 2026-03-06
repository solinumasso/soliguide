import { body } from "express-validator";
import { passwordDto } from "../../_utils/dto/password.dto";

export const pwdResetDto = [
  ...passwordDto,
  body("token").exists().notEmpty().isString(),
];
