import {
  Categories,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SERVICE_CATEGORIES_API_FR,
  SERVICE_CATEGORIES_API_ES,
  SERVICE_CATEGORIES_API_AD,
} from "../../categories/constants/service-categories.const";

const translationsCache: Record<string, Record<string, string>> = {};

export const loadTranslations = (
  lang: SupportedLanguagesCode
): Record<string, string> => {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    const translationPath = join(
      __dirname,
      "../../../common/dist/cjs/translations/locales",
      `${lang}.json`
    );
    const content = readFileSync(translationPath, "utf-8");
    translationsCache[lang] = JSON.parse(content);
    return translationsCache[lang];
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return {};
  }
};

export const getCategoryLabel = (
  categoryId: string,
  lang: SupportedLanguagesCode
): string => {
  const translations = loadTranslations(lang);
  const key = `CAT_${categoryId.toUpperCase()}`;
  return translations[key] || categoryId;
};

export const getCountryFlag = (country: SoliguideCountries): string => {
  switch (country) {
    case "fr":
      return "🇫🇷";
    case "es":
      return "🇪🇸";
    case "ad":
      return "🇦🇩";
    default:
      return "🏳️";
  }
};

export const getCategoriesServiceByCountry = (country: SoliguideCountries) => {
  switch (country) {
    case "fr":
      return SERVICE_CATEGORIES_API_FR;
    case "es":
      return SERVICE_CATEGORIES_API_ES;
    case "ad":
      return SERVICE_CATEGORIES_API_AD;
    default:
      throw new Error(`Unknown country: ${country}`);
  }
};

export const getCategoryIdsForCountry = (
  country: SoliguideCountries
): Categories[] => {
  const service = getCategoriesServiceByCountry(country);
  return service.getCategories().map((cat) => cat.id);
};
