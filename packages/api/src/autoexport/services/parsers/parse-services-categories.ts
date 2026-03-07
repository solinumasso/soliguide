import {
  SupportedLanguagesCode,
  ApiPlace,
  capitalize,
  Categories,
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
  removeDuplicates = true
): string => {
  let categories = place.services_all.map(
    (service: CommonNewPlaceService) => service.category
  );

  if (removeDuplicates) {
    categories = [...new Set(categories)];
  }

  const translatedServices = categories.map((category: Categories) =>
    translateServiceName(category, language).toLowerCase()
  );

  return capitalize(translatedServices.join(", ").trim());
};
