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
  CommonDayOpeningHours,
  CommonOpeningHours,
  PlaceClosedHolidays,
} from "@soliguide/common";
import mongoose from "mongoose";
import { DayOpeningHoursSchema } from "./day-opening-hours";
import { ModelWithId } from "../../_models/mongo";

export const OpeningHoursSchema = new mongoose.Schema<
  ModelWithId<CommonOpeningHours>
>(
  {
    closedHolidays: {
      default: PlaceClosedHolidays.UNKNOWN,
      enum: PlaceClosedHolidays,
      type: String,
    },
    description: {
      default: null,
      trim: true,
      type: String,
    },
    friday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    monday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    saturday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    sunday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    thursday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    tuesday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    wednesday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
  },
  {
    strict: true,
    _id: false,
  }
);
