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
import mongoose, { FilterQuery } from "mongoose";

import {
  TempInfoStatus,
  TempInfoType,
  type TempInfo as CommonTempInfo,
} from "@soliguide/common";

import { findTempInfoWithParams } from "../services/temp-info.service";
import type { TempInfo } from "../types";

/**
 * @param {number} placeId ID
 * @param {TempInfo | CommonTempInfo} newTempInfo Temporary information
 * @param {TempInfoType} tempInfoType Temporary information type
 * @returns a boolean which indicates wether or not a temporary information is contained between an already existing one
 */
export const checkTempInfoInterval = async (
  placeId: number,
  newTempInfo: TempInfo | CommonTempInfo,
  tempInfoType: TempInfoType,
  submitted = true
) => {
  const request: FilterQuery<TempInfo> = {
    placeId,
    status: { $ne: TempInfoStatus.OBSOLETE },
    tempInfoType,
  };

  if (newTempInfo._id) {
    request._id = {
      $ne: new mongoose.Types.ObjectId(newTempInfo._id.toString()),
    };
  }

  const startDate = new Date(newTempInfo.dateDebut);
  const endDate = newTempInfo.dateFin ? new Date(newTempInfo.dateFin) : null;

  if (endDate) {
    request.$or = [
      { dateDebut: { $lte: endDate }, dateFin: null },
      {
        dateDebut: { $lte: endDate },
        dateFin: { $gte: startDate, $ne: null },
      },
    ];
  } else if (submitted) {
    request.$or = [
      { dateFin: null },
      { dateFin: { $gte: startDate, $ne: null } },
    ];
  } else {
    request.$or = [
      { dateDebut: { $lte: startDate }, dateFin: null },
      {
        dateDebut: { $lte: startDate },
        dateFin: { $gte: startDate, $ne: null },
      },
    ];
  }

  const tempInfos = await findTempInfoWithParams(request);

  if (tempInfos?.length) {
    throw new Error("TEMP_INFOS_DATE_OVERLAPPING");
  }

  return true;
};

export const isOverlapping = (
  dateRange1: { endDate: Date | null; startDate: Date },
  dateRange2: { endDate: Date | null; startDate: Date }
) => {
  // If the second date range is contained in the first date range
  if (
    dateRange1.startDate <= dateRange2.startDate &&
    (!dateRange1.endDate || dateRange2.startDate <= dateRange1.endDate) &&
    ((!dateRange2.endDate && !dateRange1.endDate) ||
      (dateRange2.endDate &&
        (!dateRange1.endDate || dateRange2.endDate <= dateRange1.endDate)))
  ) {
    return "OVERLAPS_WITHIN";
  }
  // If the second date range overlaps entirely the first date range
  else if (
    dateRange2.startDate < dateRange1.startDate &&
    (!dateRange2.endDate || dateRange1.startDate < dateRange2.endDate) &&
    ((!dateRange1.endDate && !dateRange2.endDate) ||
      (dateRange1.endDate &&
        (!dateRange2.endDate || dateRange1.endDate < dateRange2.endDate)))
  ) {
    return "OVERLAPS_TOTALLY";
  }
  // If the second date range overlaps the first date range by the right
  else if (
    dateRange1.startDate <= dateRange2.startDate &&
    dateRange1.endDate &&
    dateRange2.startDate <= dateRange1.endDate &&
    (!dateRange2.endDate || dateRange1.endDate < dateRange2.endDate)
  ) {
    return "OVERLAPS_BY_THE_RIGHT";
  }
  // If the second date range overlaps the first date range by the left
  else if (
    dateRange2.startDate <= dateRange1.startDate &&
    dateRange2.endDate &&
    dateRange1.startDate <= dateRange2.endDate &&
    (!dateRange1.endDate || dateRange2.endDate < dateRange1.endDate)
  ) {
    return "OVERLAPS_BY_THE_LEFT";
  }
  // Else, there is no overlapping
  return "NO_OVERLAPPING";
};
