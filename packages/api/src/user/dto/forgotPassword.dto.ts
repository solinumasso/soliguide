import { body } from "express-validator";
import { emailValidDto } from "./emailValid.dto";

export const forgotPasswordDto = [
  ...emailValidDto,

  // Param to specify if the request is made from the manage admin interface
  body("isAdminRequest").optional({ nullable: true }).isBoolean(),
];
