import {
  EXPORT_COLUMNS,
  type SupportedLanguagesCode,
  type ApiPlace,
  type DocExportRow,
  ExportFileType,
  CategoriesService,
  SortingFilters,
} from "@soliguide/common";

import { convertPlaceToExportRow } from "./convertPlaceToExportRow";
import { filterServicesForExport } from "./filterServicesForExport";
import type { ExportSearchParams } from "../../interfaces";
import { translator } from "../../../config";
import type { UpComingTempInfo } from "../../types";

export const sortRows = (rows: DocExportRow[]): DocExportRow[] => {
  return rows.sort((a: DocExportRow, b: DocExportRow) => {
    const elementA = a.sectionName || "";
    const elementB = b.sectionName || "";
    if (elementA < elementB) {
      return -1;
    }
    if (elementA > elementB) {
      return 1;
    }
    return 0;
  });
};

export const translate = (
  expression: string,
  lng: SupportedLanguagesCode
): string => {
  return translator.t(expression, { lng }) || "";
};

export const renderExportRows = (
  frontUrl: string,
  categoriesService: CategoriesService,
  places: ApiPlace[],
  searchData: ExportSearchParams,
  upcomingTempInfo: UpComingTempInfo
): {
  columnsToDelete: (keyof DocExportRow)[];
  csvHeaders: {
    label: string;
    value: keyof DocExportRow;
  }[];
  rows: DocExportRow[];
  exportHeaders: DocExportRow;
} => {
  const exportSettings = searchData.exportParams;
  const lng = exportSettings.language;
  const csvHeaders: {
    label: string;
    value: keyof DocExportRow;
  }[] = [];

  let placesToExport: DocExportRow[] = [];

  places.forEach((place: ApiPlace) => {
    const existingTempInfo =
      upcomingTempInfo.filter((value) => value.placeId === place.lieu_id) ?? [];
    const tempInfo = existingTempInfo.length
      ? existingTempInfo[0].tempInfo
      : [];

    // If we need to sort by service, we add one line per service
    if (exportSettings.sortingFilter === SortingFilters.SERVICE) {
      filterServicesForExport(
        frontUrl,
        categoriesService,
        placesToExport,
        place,
        searchData,
        tempInfo
      );
    } else {
      placesToExport.push(
        convertPlaceToExportRow(
          frontUrl,
          categoriesService,
          searchData,
          place,
          tempInfo
        )
      );
    }
  });

  const columnsToDelete: (keyof DocExportRow)[] = [];

  // Select columns to delete
  Object.keys(EXPORT_COLUMNS).forEach((element: string) => {
    const key = element as unknown as keyof DocExportRow;
    if (
      typeof exportSettings.infos[key] !== "undefined" &&
      exportSettings.infos[key] === false
    ) {
      columnsToDelete.push(key);
    }
  });

  let rowId = 1;

  // Generate header of csv File
  const exportHeaders: DocExportRow = {
    rowId: "",
    lieu_id: translate("PLACE_NUMBER", lng),
    updatedAt: translate("EXPORTS_HEADER_LAST_UPDATE", lng),
    name: translate("EXPORTS_HEADER_PLACE_NAME", lng),
    address: translate("EXPORTS_HEADER_ADDRESS", lng),
    city: translate("EXPORTS_HEADER_CITY", lng),
    postalCode: translate("EXPORTS_HEADER_POSTAL_CODE", lng),
    email: translate("EXPORTS_HEADER_EMAIL", lng),
    phoneNumbers: translate("EXPORTS_HEADER_PHONES", lng),
    hours: translate("EXPORTS_HEADER_HOURS", lng),
    modalities: translate("EXPORTS_HEADER_MODALITIES", lng),
    publics: translate("EXPORTS_HEADER_PUBLICS", lng),
    services: translate("EXPORTS_HEADER_SERVICES", lng),
    tempClosure: translate("EXPORTS_HEADER_TEMP_CLOSURE", lng),
    tempMessage: translate("EXPORTS_HEADER_TEMP_MESSAGE", lng),
    tempHours: translate("EXPORTS_HEADER_TEMP_HOURS", lng),
    linkToSoliguide: translate("EXPORTS_HEADER_LINK", lng),
    latitude: translate("EXPORTS_HEADER_LATITUDE", lng),
    longitude: translate("EXPORTS_HEADER_LONGITUDE", lng),
  };

  // Sort rows before rendering
  placesToExport = sortRows(placesToExport);

  if (
    exportSettings.fileType === ExportFileType.CSV ||
    exportSettings.fileType === ExportFileType.XLSX
    // Delete unwanted columns and create JSON object
  ) {
    placesToExport.forEach((place: DocExportRow) => {
      columnsToDelete.forEach((element: keyof DocExportRow) => {
        delete place[element];
        delete exportHeaders[element];
      });

      delete place.sectionName;
      place.rowId = rowId;
      rowId++;
    });

    if (exportSettings.fileType === ExportFileType.CSV) {
      // We add headers after sort
      Object.keys(exportHeaders).forEach((element: string) => {
        const key = element as unknown as keyof DocExportRow;
        const label: string =
          typeof exportHeaders[key] !== "undefined"
            ? exportHeaders[key]?.toString() || ""
            : "";
        csvHeaders.push({ label, value: key });
      });
    }
  } else {
    placesToExport.forEach((place: DocExportRow) => {
      if (place.tempClosure) {
        if (place.tempHours) {
          place.tempHours += "\n";
        }
        if (place.tempMessage) {
          place.tempMessage += "\n";
        }
      } else if (place.tempMessage) {
        if (place.tempHours) {
          place.tempHours += "\n";
        }
      }
    });
  }

  return { columnsToDelete, exportHeaders, csvHeaders, rows: placesToExport };
};
