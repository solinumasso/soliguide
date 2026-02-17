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
import {
  ALL_DEPARTMENT_CODES,
  EMAIL_VALIDATOR_CONFIG,
  KeyStringValueString,
} from "@soliguide/common";

import { body } from "express-validator";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import { countryDto } from "../../_utils/dto";

const VALID_DEPARTMENT_CODES: string[] = [...ALL_DEPARTMENT_CODES, "99"];

export const contactEmailDto = [
  body("name")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .escape(),

  body("email")
    .exists(CHECK_STRING_NULL)
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),

  ...countryDto,

  body("department")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .isString()
    .isIn(VALID_DEPARTMENT_CODES)
    .withMessage("Veuillez vérifier que vous avez bien choisi un département"),

  body("subject")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .escape()
    .customSanitizer((value: string) => {
      const map: KeyStringValueString = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      };
      return value.replace(/[&<>]/g, (stringToEscape) => {
        return map[stringToEscape];
      });
    }),

  body("message")
    .exists()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .notEmpty()
    .withMessage("Veuillez vérifier que tout les champs sont complétés.")
    .trim()
    .customSanitizer((value: string) => {
      const map: KeyStringValueString = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      };
      return value.replace(/[&<>]/g, (stringToEscape) => {
        return map[stringToEscape];
      });
    }),
];
