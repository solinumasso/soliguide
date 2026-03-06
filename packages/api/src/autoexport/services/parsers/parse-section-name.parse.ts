import { ApiPlace, SortingFilters } from "@soliguide/common";
import { ExportSearchParams } from "../../interfaces/ExportSearchParams.interface";
import { translateServiceName } from "./parse-services-categories";

export const parseSectionName = (
  searchData: ExportSearchParams,
  place: Pick<ApiPlace, "position" | "services_all">,
  service?: any
): string => {
  if (searchData.exportParams.sortingFilter === SortingFilters.CITY) {
    return place.position?.city.trim() ?? "";
  }
  if (searchData.exportParams.sortingFilter === SortingFilters.POSTAL_CODE) {
    return place.position?.postalCode.trim() ?? "";
  }
  // For draft places whitout services
  if (!service) {
    return "";
  }

  return translateServiceName(
    service.category,
    searchData.exportParams.language
  );
};
