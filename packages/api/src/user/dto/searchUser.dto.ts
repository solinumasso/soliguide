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
