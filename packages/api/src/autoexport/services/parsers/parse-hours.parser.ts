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
  WEEK_DAYS,
  SupportedLanguagesCode,
  CommonOpeningHours,
  DayName,
  capitalize,
  CommonTimeslot,
  PlaceClosedHolidays,
} from "@soliguide/common";

import { translator } from "../../../config/i18n.config";

export const readableSlot = (slot: number | string): string => {
  const slotString = slot === 0 ? "000" : slot.toString();

  const secondPart = slotString.substring(slotString.length - 2);
  const firstPart = slotString.substring(
    slotString.length - 4,
    slotString.length - 2
  );
  return `${firstPart}h${secondPart}`;
};

export const readableTimeslot = (
  timeslots: CommonTimeslot[],
  language: SupportedLanguagesCode
): string => {
  let readableTimslotString = "";

  if (timeslots.length === 0) {
    return translator.t("CLOSED", { lng: language }).toString().toLowerCase();
  }

  if (
    timeslots.length === 1 &&
    timeslots[0].start === 0 &&
    timeslots[0].end === 2359
  ) {
    return translator.t("OPEN_24", { lng: language }).toString().toLowerCase();
  }

  for (let i = 0; i < timeslots.length; i++) {
    if (timeslots[i].start && timeslots[i].end) {
      readableTimslotString += translator.t("HOURS_FROM_TO_LIGHT", {
        lng: language,
        replace: {
          startHour: readableSlot(timeslots[i].start),
          endHour: readableSlot(timeslots[i].end),
        },
      });

      if (timeslots[i + 1]) {
        readableTimslotString += " - ";
      }
    }
  }

  return readableTimslotString;
};

export const parseHours = (
  hours: CommonOpeningHours,
  language: SupportedLanguagesCode,
  displayClosedDays = false,
  hideMinutes = true
): string => {
  let weekOpeningHoursString = "";

  const closedText = translator
    .t("CLOSED", { lng: language })
    .toString()
    .toLowerCase();

  const weekOpeningHours: { dayName: string; hours: string }[] = [];

  WEEK_DAYS.forEach((day: DayName) => {
    const dayName: string = translator
      .t(`DAY_${day.toUpperCase()}`, { lng: language })
      .toLowerCase();

    const dayHoursString = readableTimeslot(hours[day].timeslot, language);

    weekOpeningHours.push({
      dayName,
      hours: dayHoursString,
    });
  });

  const mergedSameOpeningHours = [];

  let idx = -1;

  for (let i = 0; i < weekOpeningHours.length; i++) {
    const currentDay = weekOpeningHours[i];
    // Compare with last opening hours
    if (idx === -1 || mergedSameOpeningHours[idx].hours !== currentDay.hours) {
      mergedSameOpeningHours.push({
        days: [currentDay.dayName],
        hours: currentDay.hours,
      });

      idx++;
    } else {
      mergedSameOpeningHours[idx].days.push(currentDay.dayName);
    }
  }

  // Merge all same hours with format : Monday to Friday: 4pm
  const lines = [];
  const linkDays = translator
    .t("DAYS_LINK_TO", { lng: language })
    .replace(/\s/g, "");

  for (let i = 0; i < mergedSameOpeningHours.length; i++) {
    const line = mergedSameOpeningHours[i];
    const days = line.days;

    // Only one day
    if (days.length === 1) {
      const oneDay = capitalize(`${days[0]}: ${line.hours}`);

      if (displayClosedDays || line.hours !== closedText) {
        lines.push(oneDay);
      }
    }
    // Multiple days, we merge first and last value
    else {
      const multipleDays = capitalize(
        `${days[0]} ${linkDays} ${days[days.length - 1]}: ${line.hours}`
      );

      if (displayClosedDays || line.hours !== closedText) {
        lines.push(multipleDays);
      }
    }
  }

  weekOpeningHoursString = lines.join("\n");
  if (hideMinutes) {
    weekOpeningHoursString = weekOpeningHoursString.replace(/h00/g, "h");
  }

  // Add holidays information at the beginning if the place is closed on holidays
  if (hours?.closedHolidays === PlaceClosedHolidays.CLOSED) {
    const closedHolidaysText = translator.t("EXPORT_CLOSED_HOLIDAYS", {
      lng: language,
    });
    weekOpeningHoursString = `${closedHolidaysText}${
      weekOpeningHoursString ? `\n${weekOpeningHoursString}` : ""
    }`;
  }

  return weekOpeningHoursString.replace(/^\s+|\s+$/g, "");
};
