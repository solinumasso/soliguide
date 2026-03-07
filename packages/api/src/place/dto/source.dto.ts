import { body } from "express-validator";
import { stringDto, checkUrlFieldDto } from "../../_utils/dto";

export const sourceDto = [
  stringDto("source.name", true, 100),
  stringDto("source.id", true, 50),
  body("source.isOrigin").exists().isBoolean(),
  checkUrlFieldDto("source.license"),
  checkUrlFieldDto("source.url"),
];
