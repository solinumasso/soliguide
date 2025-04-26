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
  CommonOpeningHours,
  PlaceClosedHolidays,
  PlaceType,
  WEEK_DAYS,
} from "@soliguide/common";

import { body } from "express-validator";

import { isValidDay } from "../../_utils/hours-custom.functions";

export const checkDays = (
  path: string,
  placeType: PlaceType,
  isOptional = false
) => {
  let wholeBody = body(path.replace(/\.\s*$/, ""));
  if (isOptional) {
    wholeBody = wholeBody.optional({ nullable: true });
  } else {
    wholeBody = wholeBody.exists();
  }

  return [
    wholeBody
      .isObject()
      .notEmpty()
      .customSanitizer((hours) => {
        hours = new CommonOpeningHours(hours);

        WEEK_DAYS.forEach((dayName: string, index: number) => {
          const nextDay = WEEK_DAYS[(index + 1) % WEEK_DAYS.length];
          const dayOpeningHours = hours[dayName];
          const lastHours =
            dayOpeningHours.timeslot[dayOpeningHours.timeslot.length - 1];

          if (!hours[nextDay]) {
            hours[nextDay] = {
              open: false,
              timeslot: [],
            };
          }

          if (lastHours && lastHours.end < lastHours.start) {
            hours[nextDay].timeslot.unshift({
              start: "0",
              end: lastHours.end.toString(),
            });

            hours[nextDay].open = true;

            lastHours.end = 2359;
          }
        });
        return hours;
      }),
    ...WEEK_DAYS.map((dayName: string) => {
      let weekBody = body(path + dayName);
      if (isOptional) {
        weekBody = weekBody.optional({ nullable: true });
      } else {
        weekBody = weekBody.exists();
      }
      return weekBody
        .isObject()
        .notEmpty()
        .custom((day) => isValidDay(day, placeType));
    }),
  ];
};

export const hoursDto = (path = "newhours.", placeType = PlaceType.PLACE) => {
  return [
    body(path + "description")
      .optional({ nullable: true })
      .isString()
      .trim(),

    ...checkDays(path, placeType),

    body(path + "closedHolidays")
      .exists()
      .isIn(Object.values(PlaceClosedHolidays)),
  ];
};
