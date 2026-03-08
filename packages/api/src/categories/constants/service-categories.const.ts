import {
  initializeCategoriesApiByTheme,
  initializeCategoriesForCategoriesApiV2,
  Themes,
} from "@soliguide/common";

// all categories for the API independently of the theme
export const SERVICE_CATEGORIES_API_ALL = initializeCategoriesApiByTheme();

export const SERVICE_CATEGORIES_API_FR = initializeCategoriesApiByTheme(
  Themes.SOLIGUIDE_FR
);

export const SERVICE_CATEGORIES_API_ES = initializeCategoriesApiByTheme(
  Themes.SOLIGUIA_ES
);

export const SERVICE_CATEGORIES_API_AD = initializeCategoriesApiByTheme(
  Themes.SOLIGUIA_AD
);

export const SERVICE_CATEGORIES_API_ALL_V2 =
  initializeCategoriesForCategoriesApiV2();
