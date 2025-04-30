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

import { CommonOpeningHours } from "../classes/CommonOpeningHours.class";
import { is24HoursOpen, isOneDayOpen } from "./placeHours.function";

describe("isOneDayOpen", () => {
  it("should return false if all days are closed", () => {
    const closedHours = new CommonOpeningHours();
    expect(isOneDayOpen(closedHours)).toBe(false);
  });

  it("should return true if at least one day is open", () => {
    const openMonday = new CommonOpeningHours({
      monday: {
        open: true,
        timeslot: [{ start: 900, end: 1200 }],
      },
    });
    expect(isOneDayOpen(openMonday)).toBe(true);
  });

  it("should return false if hours is undefined", () => {
    expect(isOneDayOpen(undefined)).toBe(false);
  });
});

describe("is24HoursOpen", () => {
  const fullDaySlot = { start: 0, end: 2359 };
  const shortDaySlot = { start: 1000, end: 1800 };

  it("should return false if hours is not gived as a parameter", () => {
    expect(is24HoursOpen()).toBe(false);
  });

  it("should return true if all days have 00:00 to 23:59 slot", () => {
    const fullWeek = new CommonOpeningHours({
      monday: { open: true, timeslot: [fullDaySlot] },
      tuesday: { open: true, timeslot: [fullDaySlot] },
      wednesday: { open: true, timeslot: [fullDaySlot] },
      thursday: { open: true, timeslot: [fullDaySlot] },
      friday: { open: true, timeslot: [fullDaySlot] },
      saturday: { open: true, timeslot: [fullDaySlot] },
      sunday: { open: true, timeslot: [fullDaySlot] },
    });

    expect(is24HoursOpen(fullWeek)).toBe(true);
  });

  it("should return false if one day does not have full slot", () => {
    const almostFullWeek = new CommonOpeningHours({
      monday: { open: true, timeslot: [fullDaySlot] },
      tuesday: { open: true, timeslot: [fullDaySlot] },
      wednesday: { open: true, timeslot: [fullDaySlot] },
      thursday: { open: true, timeslot: [fullDaySlot] },
      friday: { open: true, timeslot: [shortDaySlot] },
      saturday: { open: true, timeslot: [fullDaySlot] },
      sunday: { open: true, timeslot: [fullDaySlot] },
    });

    expect(is24HoursOpen(almostFullWeek)).toBe(false);
  });

  it("should return false if hours is null", () => {
    expect(is24HoursOpen(null)).toBe(false);
  });
});
