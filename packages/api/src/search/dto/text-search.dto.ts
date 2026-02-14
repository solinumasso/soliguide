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
  slugString,
  SOLIGUIDE_COUNTRIES,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";
import { body, param } from "express-validator";
import { CHECK_STRING_NULL } from "../../config";

export const textSearchDto = (key: string) => {
  return [
    body(key)
      .if(body(key).exists(CHECK_STRING_NULL))
      .isString()
      .trim()
      .escape()
      .customSanitizer((string: string) => slugString(string)),
  ];
};

export const searchSuggestionDto = (key: string) => {
  return [
    param("lang").if(body("lang").exists()).isIn(SUPPORTED_LANGUAGES),
    param("country").exists(CHECK_STRING_NULL).isIn(SOLIGUIDE_COUNTRIES),
    param(key)
      .stripLow()
      .blacklist("<>&\"'=(){}[];")
      .trim()
      .isLength({ min: 2, max: 100 })
      .notEmpty()
      .escape(),
  ];
};
