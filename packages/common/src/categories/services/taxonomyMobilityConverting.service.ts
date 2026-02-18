/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
  return LEGACY_MOBILITY_CATEGORIES_MAPPING[
    oldCategory as LegacyMobilityCategory
  ];
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
  return entry?.[0] as LegacyMobilityCategory | undefined;
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
