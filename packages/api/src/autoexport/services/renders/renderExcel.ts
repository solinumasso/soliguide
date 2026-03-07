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
