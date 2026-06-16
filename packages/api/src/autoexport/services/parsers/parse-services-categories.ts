import {
  SupportedLanguagesCode,
  ApiPlace,
  capitalize,
  Categories,
  CategoriesService,
  CommonNewPlaceService,
  getCategoryTranslationKey,
} from "@soliguide/common";

import { translator } from "../../../config/i18n.config";

export const translateServiceName = (
  category: Categories,
  language: SupportedLanguagesCode
): string => {
  return translator.t(getCategoryTranslationKey(category), { lng: language });
};

export const getAllServicesNames = (
  place: ApiPlace,
  language: SupportedLanguagesCode,
  removeDuplicates = true,
  categoriesService?: CategoriesService
): string => {
  let categories = place.services_all
    .map((service: CommonNewPlaceService) => service.category)
    .filter(Boolean) as Categories[];

  if (removeDuplicates) {
    categories = [...new Set(categories)];
  }

  const translatedServices = categories.map((category: Categories) => {
    const serviceName = capitalize(translateServiceName(category, language));
    if (categoriesService) {
      const parentCategory =
        categoriesService.getParentCategoryIfNeedPrefix(category);
      if (parentCategory) {
        const parentName = capitalize(
          translateServiceName(parentCategory, language)
        );
        return `${parentName}: ${serviceName}`;
      }
    }
    return serviceName;
  });

  return translatedServices.join(", ").trim();
};
