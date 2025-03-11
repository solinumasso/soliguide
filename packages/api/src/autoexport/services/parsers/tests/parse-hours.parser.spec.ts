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
  SupportedLanguagesCode,
} from "@soliguide/common";

import { parseHours } from "../parse-hours.parser";

describe("Parse hours, display in string", () => {
  const hours: CommonOpeningHours = {
    description: "",
    closedHolidays: PlaceClosedHolidays.OPEN,
    monday: {
      open: false,
      timeslot: [],
    },
    tuesday: {
      open: false,
      timeslot: [],
    },
    wednesday: {
      open: false,
      timeslot: [],
    },
    thursday: {
      open: false,
      timeslot: [],
    },
    friday: {
      open: false,
      timeslot: [],
    },
    saturday: {
      open: false,
      timeslot: [],
    },
    sunday: {
      open: true,
      timeslot: [
        {
          end: 1500,
          start: 930,
        },
      ],
    },
  };

  it("Parse hours and hide closed days", () => {
    expect(parseHours(hours, SupportedLanguagesCode.FR)).toEqual(
      "Dimanche: 9h30 à 15h"
    );
    expect(parseHours(hours, SupportedLanguagesCode.EN)).toEqual(
      "Sunday: 9h30 to 15h"
    );
  });

  it("Parse hours and display closed days", () => {
    expect(parseHours(hours, SupportedLanguagesCode.EN, true)).toEqual(
      "Monday At Saturday: closed\nSunday: 9h30 to 15h"
    );
  });

  it("Parse hours and display minutes", () => {
    expect(parseHours(hours, SupportedLanguagesCode.EN, true, false)).toEqual(
      "Monday At Saturday: closed\nSunday: 9h30 to 15h00"
    );
  });

  it("When the schedules are the same several days in a row, I display a condensed version of the schedules.", () => {
    const hoursBusinessDays: CommonOpeningHours = {
      description: "",
      closedHolidays: PlaceClosedHolidays.OPEN,
      monday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      tuesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      wednesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      thursday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      friday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      saturday: {
        open: false,
        timeslot: [],
      },
      sunday: {
        open: true,
        timeslot: [
          {
            end: 1500,
            start: 930,
          },
        ],
      },
    };

    expect(
      parseHours(hoursBusinessDays, SupportedLanguagesCode.EN, false, true)
    ).toEqual("Monday At Friday: 9h to 17h\nSunday: 9h30 to 15h");
  });

  it("A week with opening hours that do not follow each other: open on Monday, closed on Tuesday, open on Wednesday and Thursday", () => {
    const hoursBusinessDays: CommonOpeningHours = {
      description: "",
      closedHolidays: PlaceClosedHolidays.OPEN,
      monday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      tuesday: {
        open: false,
        timeslot: [],
      },
      wednesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      thursday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      friday: {
        open: false,
        timeslot: [],
      },
      saturday: {
        open: false,
        timeslot: [],
      },
      sunday: {
        open: true,
        timeslot: [
          {
            end: 1500,
            start: 930,
          },
        ],
      },
    };

    expect(
      parseHours(hoursBusinessDays, SupportedLanguagesCode.EN, false, true)
    ).toEqual(
      "Monday: 9h to 17h\nWednesday At Thursday: 9h to 17h\nSunday: 9h30 to 15h"
    );
  });

  it("When the schedules are the same several days in a row, I display a condensed version of the schedules.", () => {
    const hoursBusinessDays: CommonOpeningHours = {
      description: "",
      closedHolidays: PlaceClosedHolidays.OPEN,
      monday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      tuesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      wednesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      thursday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      friday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      saturday: {
        open: false,
        timeslot: [],
      },
      sunday: {
        open: true,
        timeslot: [
          {
            end: 1500,
            start: 930,
          },
        ],
      },
    };

    expect(
      parseHours(hoursBusinessDays, SupportedLanguagesCode.EN, false, true)
    ).toEqual("Monday At Friday: 9h to 17h\nSunday: 9h30 to 15h");
  });

  it("Several time slots in the same day", () => {
    const hoursBusinessDays: CommonOpeningHours = {
      description: "",
      closedHolidays: PlaceClosedHolidays.OPEN,
      monday: {
        open: true,
        timeslot: [
          {
            end: 1200,
            start: 900,
          },
          {
            end: 1900,
            start: 1400,
          },
        ],
      },
      tuesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      wednesday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      thursday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      friday: {
        open: true,
        timeslot: [
          {
            end: 1700,
            start: 900,
          },
        ],
      },
      saturday: {
        open: false,
        timeslot: [],
      },
      sunday: {
        open: true,
        timeslot: [
          {
            end: 1100,
            start: 930,
          },
          {
            end: 1500,
            start: 1330,
          },
          {
            end: 1900,
            start: 2330,
          },
        ],
      },
    };

    expect(
      parseHours(hoursBusinessDays, SupportedLanguagesCode.EN, false, true)
    ).toEqual(
      "Monday: 9h to 12h - 14h to 19h\nTuesday At Friday: 9h to 17h\nSunday: 9h30 to 11h - 13h30 to 15h - 23h30 to 19h"
    );
  });
});
