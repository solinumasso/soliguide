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
import { OpeningHoursContext } from "../enums";
import { CommonTimeslot } from "./CommonTimeSlot.class";

export class CommonDayOpeningHours {
  public open: boolean;
  public timeslot: CommonTimeslot[];

  constructor(
    dayHour?: Partial<CommonDayOpeningHours>,
    context?: OpeningHoursContext
  ) {
    this.timeslot = [];

    if (dayHour?.timeslot) {
      dayHour.timeslot
        .filter(
          (timeSlot: CommonTimeslot) => timeSlot.end && timeSlot.start != null // check null of undefined to include a possible start at 0
        )
        .sort((timeSlotA, timeSlotB) => {
          if (timeSlotA.start < timeSlotB.start) {
            return -1;
          }
          if (timeSlotA.start > timeSlotB.start) {
            return 1;
          }
          return 0;
        })
        .forEach((timeSlot: CommonTimeslot) =>
          this.timeslot.push(new CommonTimeslot(timeSlot, context))
        );
    }
    this.open = this.timeslot.length > 0;
  }
}
