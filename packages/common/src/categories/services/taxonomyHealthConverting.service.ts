import { Categories } from "../enums";
import {
  LEGACY_HEALTH_CATEGORIES_MAPPING,
  type LegacyHealthCategory,
} from "../constants";

export const convertOldToNewHealthCategory = (
  oldCategory: string
): Categories | undefined => {
  return LEGACY_HEALTH_CATEGORIES_MAPPING[oldCategory];
};

export const convertNewToOldHealthCategory = (
  newCategory: Categories
): LegacyHealthCategory | undefined => {
  const entry = Object.entries(LEGACY_HEALTH_CATEGORIES_MAPPING).find(
    ([, value]) => value === newCategory
  );
  return entry?.[0];
};

export const isLegacyHealthCategory = (
  category: string
): category is LegacyHealthCategory => {
  return category in LEGACY_HEALTH_CATEGORIES_MAPPING;
};

export const isNewHealthCategory = (category: Categories): boolean => {
  return Object.values(LEGACY_HEALTH_CATEGORIES_MAPPING).includes(category);
};
