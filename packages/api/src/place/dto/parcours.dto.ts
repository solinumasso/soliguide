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
import { CommonOpeningHours, PlaceType } from "@soliguide/common";

import mongoose from "mongoose";
import { body } from "express-validator";
import { positionDto } from "./position.dto";
import { isValidHoursObject } from "../../_utils/hours-custom.functions";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const parcoursDto = [
  ...positionDto("*.position."),

  body("*.description")
    .if((value: any) => value)
    .exists(CHECK_STRING_NULL)
    .isString()
    .trim()
    .isLength({ max: 100, min: 1 }),

  body("*.hours")
    .custom((hours) => isValidHoursObject(hours, PlaceType.ITINERARY))
    .customSanitizer((hours) => new CommonOpeningHours(hours)),

  body("*.photos")
    .isArray()
    .customSanitizer((photos: any[]) => {
      if (!photos?.length) {
        return [];
      }
      return photos.map((photo) => {
        photo._id = new mongoose.Types.ObjectId(photo._id);
        return photo;
      });
    }),
];
