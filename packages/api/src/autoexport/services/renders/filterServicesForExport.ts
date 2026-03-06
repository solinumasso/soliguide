import {
  type ApiPlace,
  CommonNewPlaceService,
  DocExportRow,
  CategoriesService,
} from "@soliguide/common";

import { convertPlaceToExportRow } from "./convertPlaceToExportRow";
import { TempInfo } from "../../../temp-info/types";
import { ExportSearchParams } from "../../interfaces";

export const filterServicesForExport = (
  frontUrl: string,
  categoriesService: CategoriesService,
  placesToExport: DocExportRow[],
  place: ApiPlace,
  searchData: ExportSearchParams,
  upcomingTempInfo: TempInfo[]
): void => {
  const categoryChoosen = searchData?.category;

  if (categoryChoosen) {
    const categoriesInvolved =
      categoriesService.getFlatLeavesFromRootCategory(categoryChoosen);

    place.services_all = place.services_all.filter(
      (service: CommonNewPlaceService) =>
        service.category && categoriesInvolved.includes(service.category)
    );
  }

  for (let i = 0; i < place.services_all.length; i++) {
    const placeToExport = convertPlaceToExportRow(
      frontUrl,
      categoriesService,
      searchData,
      place,
      upcomingTempInfo,
      true,
      i
    );
    placesToExport.push(placeToExport);
  }
};
