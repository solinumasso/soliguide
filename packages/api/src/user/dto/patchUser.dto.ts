/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Categories, isSupportedLanguage } from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { commonUserFormDto } from "./commonUserForm.dto";

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
