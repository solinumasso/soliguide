import { DocExportRow } from "./DocExportRow.interface";

import { ExportFileType, SortingFilters } from "../enums";

import { SupportedLanguagesCode } from "../../translations";

export interface ExportParams {
  fileType: ExportFileType;
  language: SupportedLanguagesCode;
  sortingFilter: SortingFilters;
  showUpcomingTempInfo: boolean;
  infos: { [key in keyof DocExportRow]?: boolean };
}
