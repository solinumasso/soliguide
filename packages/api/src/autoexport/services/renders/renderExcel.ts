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
import { ApiPlace, CategoriesService } from "@soliguide/common";

import { format } from "date-fns";

import * as XLSX from "xlsx";

import { renderExportRows } from "./renderExportRows";

import { ExportSearchParams } from "../../interfaces";
import { UpComingTempInfo } from "../../types";

export const renderExcel = (
  frontUrl: string,
  categoriesService: CategoriesService,
  places: ApiPlace[],
  searchData: ExportSearchParams,
  upcomingTempInfo: UpComingTempInfo
): Buffer => {
  const { exportHeaders, rows } = renderExportRows(
    frontUrl,
    categoriesService,
    places,
    searchData,
    upcomingTempInfo
  );
  const today = format(new Date(), "dd-MM-yyyy");
  rows.unshift(exportHeaders);
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, {
    skipHeader: true,
  });
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export Soliguide " + today);
  return XLSX.writeXLSX(wb, { type: "buffer", compression: true });
};
