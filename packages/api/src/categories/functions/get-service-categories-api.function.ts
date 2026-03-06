
import { CategoriesService, Themes } from "@soliguide/common";
import {
  SERVICE_CATEGORIES_API_AD,
  SERVICE_CATEGORIES_API_ALL,
  SERVICE_CATEGORIES_API_ALL_V2,
  SERVICE_CATEGORIES_API_ES,
  SERVICE_CATEGORIES_API_FR,
} from "../constants/service-categories.const";
import { TypeCategoriesService } from "../types/categories-service.type";
import { TypeCategoriesServiceNotFromThemeEnum } from "../enums/type-categories-service-not-from-theme.enum";

export const getServiceCategoriesApi = (
  typeCategoriesService: TypeCategoriesService
): CategoriesService => {
  switch (typeCategoriesService) {
    case TypeCategoriesServiceNotFromThemeEnum.ALL:
      return SERVICE_CATEGORIES_API_ALL;
    case TypeCategoriesServiceNotFromThemeEnum.V2:
      return SERVICE_CATEGORIES_API_ALL_V2;
    case Themes.SOLIGUIDE_FR:
      return SERVICE_CATEGORIES_API_FR;
    case Themes.SOLIGUIA_ES:
      return SERVICE_CATEGORIES_API_ES;
    case Themes.SOLIGUIA_AD:
      return SERVICE_CATEGORIES_API_AD;
    default:
      return SERVICE_CATEGORIES_API_ALL;
  }
};
