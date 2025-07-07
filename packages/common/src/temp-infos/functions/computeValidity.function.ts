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
import { TempInfoStatus } from "../enums";

export const computeValidity = (
  startDate: Date | null,
  endDate: Date | null
): {
  active: boolean;
  infoColor: InfoColor;
  status: TempInfoStatus | null;
} => {
  const result: {
    active: boolean;
    infoColor: InfoColor;
    status: TempInfoStatus | null;
  } = {
    active: false,
    infoColor: "",
    status: null,
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
    result.active = true;
  }

  if (result.active) {
    const isCurrent = diffStartDateAndNow <= 0;

    result.infoColor = isCurrent
      ? "danger" // From start day until the end
      : "warning"; // 15 days before the start date;
    result.status = isCurrent
      ? TempInfoStatus.CURRENT
      : TempInfoStatus.INCOMING;

    return result;
  }

  if (diffStartDateAndNow > 15 && diffEndDateAndNow >= 0) {
    result.status = TempInfoStatus.FUTURE;
    return result;
  }

  result.status = TempInfoStatus.OBSOLETE;
  return result;
};
