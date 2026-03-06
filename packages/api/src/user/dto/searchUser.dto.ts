
import { body } from "express-validator";

import { UserSearchContext, UserStatus } from "@soliguide/common";
import { territoriesDto } from "../../_utils/dto/territories.dto";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { searchOptionsDto } from "../../general/dto/searchOptions.dto";

export const searchUserDto = [
  body("name").if(body("name").exists(CHECK_STRING_NULL)).trim(),

  body("mail").if(body("mail").exists(CHECK_STRING_NULL)).trim(),

  body("status")
    .if(body("status").exists(CHECK_STRING_NULL))
    .isIn(Object.values(UserStatus)),

  body("verified")
    .if(body("verified").exists(CHECK_STRING_NULL))
    .isBoolean()
    .toBoolean(),

  body("developer")
    .if(body("developer").exists(CHECK_STRING_NULL))
    .isBoolean()
    .toBoolean(),

  body("options.sortBy")
    .if(body("options.sortBy").exists(CHECK_STRING_NULL))
    .isIn([
      "createdAt",
      "lastname",
      "mail",
      "name",
      "status",
      "territories",
      "user_id",
      "verified",
      "updatedAt",
    ]),

  body("context").isIn(Object.values(UserSearchContext)),

  ...searchOptionsDto,

  ...territoriesDto,
];
