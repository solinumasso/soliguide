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
import { Publics, publicsValuesAreCoherent } from "@soliguide/common";

import { body } from "express-validator";

import { administrativeDto } from "./administrative.dto";
import { ageDto } from "./age.dto";
import { familyDto } from "./family.dto";

import { genderDto } from "./gender.dto";
import { languagesDto } from "./languages.dto";
import { otherDto } from "./other.dto";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const publicsDto = (path = "") => {
  return [
    body(path + "publics.accueil").isInt({
      allow_leading_zeroes: true,
      max: 2,
      min: 0,
    }),

    body(path + "publics.description")
      .customSanitizer((value) => {
        return !value ? null : value.toString().trim();
      })
      .if(body("description").exists(CHECK_STRING_NULL))
      .isLength({ max: 4000 }),

    body(path + "isCampaign")
      .optional()
      .exists()
      .isBoolean(),

    // Check on gender
    ...genderDto(path),

    // Check on administrative status
    ...administrativeDto(path),

    // Check on family situation
    ...familyDto(path),

    // Check on other situation
    ...otherDto(path),

    // Check on age
    ...ageDto(path),

    // Check variation for preferential or exclusive publics
    body(path + "publics").custom((value: Publics) => {
      if (publicsValuesAreCoherent(value)) {
        return true;
      }
      throw new Error("NO_PUBLICS_VARIATION");
    }),

    // Check on languages
    ...languagesDto(path),
  ];
};
