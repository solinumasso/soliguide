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
import { differenceInCalendarDays } from "date-fns";
import { InfoColor } from "../types";

export const getInfoColor = (
  startDate: Date | null,
  endDate: Date | null
): {
  actif: boolean;
  infoColor: InfoColor;
} => {
  const result: {
    actif: boolean;
    infoColor: InfoColor;
  } = {
    actif: false,
    infoColor: "",
  };

  if (!startDate) {
    return result;
  }

  // Today
  const now = new Date();
  // Difference between the beginning date and today
  const diffStartDateAndNow = differenceInCalendarDays(startDate, now);
  // Difference between the ending date and today
  const diffEndDateAndNow = endDate
    ? differenceInCalendarDays(endDate, now)
    : 0;

  if (diffStartDateAndNow <= 15 && diffEndDateAndNow >= 0) {
    result.actif = true;
  }

  if (result.actif) {
    result.infoColor =
      diffStartDateAndNow <= 0
        ? "danger" // From start day until the end
        : "warning"; // 15 days before the start date
  }

  return result;
};
