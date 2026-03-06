import { ApiPlace, CategoriesService } from "@soliguide/common";

import { Parser } from "json2csv";

import { renderExportRows } from "./renderExportRows";

import { ExportSearchParams } from "../../interfaces";
import { UpComingTempInfo } from "../../types";

export const renderCsv = (
  frontUrl: string,
  categoriesService: CategoriesService,
  places: ApiPlace[],
  searchData: ExportSearchParams,
  upcomingTempInfo: UpComingTempInfo
): string => {
  const { csvHeaders, rows } = renderExportRows(
    frontUrl,
    categoriesService,
    places,
    searchData,
    upcomingTempInfo
  );

  const json2csvParser = new Parser({ fields: csvHeaders });
  return json2csvParser.parse(rows);
};
