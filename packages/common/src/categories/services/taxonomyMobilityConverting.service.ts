
import { Categories } from "../enums";
import {
  LEGACY_MOBILITY_CATEGORIES_MAPPING,
  type LegacyMobilityCategory,
} from "../constants";

/**
 * Converts an old mobility category to the new category format
 * @param oldCategory - The old category key (e.g., "chauffeur_driven_transport")
 * @returns The new category enum value or undefined if not found
 */
export const convertOldToNewMobilityCategory = (
  oldCategory: string
): Categories | undefined => {
  return LEGACY_MOBILITY_CATEGORIES_MAPPING[oldCategory];
};

/**
 * Converts a new mobility category back to the old category format
 * Creates a reverse mapping from LEGACY_MOBILITY_CATEGORIES_MAPPING
 * @param newCategory - The new category enum value
 * @returns The old category key or undefined if not found
 */
export const convertNewToOldMobilityCategory = (
  newCategory: Categories
): LegacyMobilityCategory | undefined => {
  const entry = Object.entries(LEGACY_MOBILITY_CATEGORIES_MAPPING).find(
    ([, value]) => value === newCategory
  );
  return entry?.[0];
};

/**
 * Checks if a category is a legacy mobility category
 * @param category - The category to check
 * @returns True if the category is a legacy mobility category
 */
export const isLegacyMobilityCategory = (
  category: string
): category is LegacyMobilityCategory => {
  return category in LEGACY_MOBILITY_CATEGORIES_MAPPING;
};

/**
 * Checks if a category is a new mobility category (one that was converted from legacy)
 * @param category - The category to check
 * @returns True if the category is a new mobility category
 */
export const isNewMobilityCategory = (category: Categories): boolean => {
  return Object.values(LEGACY_MOBILITY_CATEGORIES_MAPPING).includes(category);
};
