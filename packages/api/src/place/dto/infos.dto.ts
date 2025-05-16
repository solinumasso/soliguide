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

import { entityDto } from "./entity.dto";

import { countryDto, stringDto } from "../../_utils/dto";

export const infoDto = (auto = false) => [
  // Whether the place is automatically inserted
  body("auto").customSanitizer((value) => {
    value = auto;
    return value;
  }),

  // Place name must be between 3 and 250 characters
  body("name").isString().trim().isLength({ max: 250, min: 3 }),

  // Place description must be between 10 and 4000 characters
  stringDto("description", false, 4000, 10),
  ...countryDto,
  ...entityDto,
];
