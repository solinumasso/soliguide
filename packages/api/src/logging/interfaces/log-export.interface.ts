import {
  SupportedLanguagesCode,
  DocExportRow,
  ExportFileType,
  SortingFilters,
} from "@soliguide/common";
import { LogSearchPlaces } from "./log-search-places.interface";

export interface LogExport extends LogSearchPlaces {
  // Date when the export ended
  exportEndedAt: Date;

  // Date when the export started
  exportStartedAt: Date;

  // Export file format
  fileType: ExportFileType;

  languages: SupportedLanguagesCode;

  selectedParams: {
    [key in keyof DocExportRow]?: boolean;
  };

  sortingFilter: SortingFilters;

  word: string;
}
