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
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { AnyDepartmentCode } from "@soliguide/common";

export const changeUserTerritoryDto = [
  body("territories")
    .if(body("territories").exists(CHECK_STRING_NULL))
    .isArray()
    .withMessage("Territories must be an array")
    .custom((territories) => {
      for (const territory of territories) {
        if (typeof territory !== "string") {
          throw new Error("INVALID_TERRITORY_FORMAT");
        }
      }
      return true;
    })
    .customSanitizer((territories: AnyDepartmentCode[]) => {
      return [...new Set(territories)];
    }),

  body("areas.*.departments")
    .if(body("areas.*.departments").exists(CHECK_STRING_NULL))
    .isArray()
    .customSanitizer((departments: AnyDepartmentCode[]) => {
      return [...new Set(departments)];
    }),
];
