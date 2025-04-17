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
import { body } from "express-validator";

import { territoriesDto, checkUrlFieldDto } from "../../_utils/dto";
import { formatPhoneNumber } from "../../_utils/functions/formatPhoneNumber.functions";

import {
  CHECK_STRING_NULL,
  EMAIL_NORMALIZE_OPTIONS,
} from "../../config/expressValidator.config";
import {
  EMAIL_VALIDATOR_CONFIG,
  Phone,
  REGEXP,
  RELATIONS,
} from "@soliguide/common";
import { checkPhone } from "../../place/dto/phones.dto";

export const baseEditOrganizationDto = [
  body("name")
    .exists(CHECK_STRING_NULL)
    .isLength({ max: 200 })
    .isString()
    .trim(),

  body("description")
    .if(body("description").exists(CHECK_STRING_NULL))
    .isLength({ max: 4000, min: 10 })
    .isString()
    .trim(),

  body("mail")
    .if(body("mail").exists(CHECK_STRING_NULL))
    .trim()
    .isEmail(EMAIL_VALIDATOR_CONFIG)
    .normalizeEmail(EMAIL_NORMALIZE_OPTIONS),

  body("phone")
    .if(body("phone").exists(CHECK_STRING_NULL))
    .custom((phone: Phone) => checkPhone(phone)),

  body("fax")
    .if(body("fax").exists(CHECK_STRING_NULL))
    .trim()
    .matches(REGEXP.phone)
    .customSanitizer((value) => formatPhoneNumber(value)),

  checkUrlFieldDto("facebook"),
  checkUrlFieldDto("website"),

  body("relations")
    // TODO to remove once territories admin would have fill out the relationships
    .if(body("relations").notEmpty())
    .notEmpty()
    .isArray()
    .custom((relations) => {
      for (const relation of relations) {
        if (!RELATIONS.includes(relation)) {
          throw new Error("WRONG_RELATION");
        }
      }
      return true;
    }),
];

export const createOrgaDto = [...baseEditOrganizationDto, ...territoriesDto];
export const patchOrgaDto = [...baseEditOrganizationDto];
