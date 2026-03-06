import { Categories, isSupportedLanguage } from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { commonUserFormDto } from "./commonUserForm.dto";
import { territoriesDto } from "../../_utils/dto/territories.dto";

const baseEditUserDto = [
  ...commonUserFormDto(),
  body("translator").optional().isBoolean(),
  body("languages")
    .if(
      body("translator")
        .isBoolean()
        .custom((translator) => translator)
    )
    .isArray()
    .custom((languages) => {
      for (const lang of languages) {
        if (!isSupportedLanguage(lang)) {
          throw new Error("BAD_LANGUAGE_VALUE");
        }
      }
      return true;
    }),
];

export const patchMyAccountDto = [...baseEditUserDto];

export const patchUserDto = [
  ...baseEditUserDto,
  ...territoriesDto,
  body("categoriesLimitations")
    .customSanitizer((categories, { req }) => {
      if (req.isSuperAdmin) {
        return categories;
      }
      delete req.body.categoriesLimitations;
    })
    .if(body("categoriesLimitations").exists(CHECK_STRING_NULL))
    .custom((categories) => {
      for (const category of categories) {
        if (!Object.values(Categories).includes(category)) {
          throw new Error("WRONG_CATEGORY_ID");
        }
      }
      return true;
    }),
];

// Users edition from the contact edition form
export const patchUserFromContactDto = [...commonUserFormDto()];
