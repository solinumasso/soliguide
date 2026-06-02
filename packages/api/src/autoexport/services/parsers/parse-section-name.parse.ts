import {
  ApiPlace,
  CategoriesService,
  CommonNewPlaceService,
  SortingFilters,
} from "@soliguide/common";
import { ExportSearchParams } from "../../interfaces/ExportSearchParams.interface";
import { translateServiceName } from "./parse-services-categories";

export const parseSectionName = (
  searchData: ExportSearchParams,
  place: Pick<ApiPlace, "position" | "services_all">,
  service?: CommonNewPlaceService,
  categoriesService?: CategoriesService
): string => {
  if (searchData.exportParams.sortingFilter === SortingFilters.CITY) {
    return place.position?.city.trim() ?? "";
  }
  if (searchData.exportParams.sortingFilter === SortingFilters.POSTAL_CODE) {
    return place.position?.postalCode.trim() ?? "";
  }
  // For draft places without services
  if (!service?.category) {
    return "";
  }

  const serviceName = translateServiceName(
    service.category,
    searchData.exportParams.language
  );

  if (categoriesService) {
    const parentCategory = categoriesService.getParentCategoryIfNeedPrefix(
      service.category
    );
    if (parentCategory) {
      const parentName = translateServiceName(
        parentCategory,
        searchData.exportParams.language
      );
      return `${parentName}: ${serviceName}`;
    }
  }

  return serviceName;
};
