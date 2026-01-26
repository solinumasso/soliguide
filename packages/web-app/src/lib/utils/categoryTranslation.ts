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
import {
  Categories,
  getCategoryTranslationKey as getCommonCategoryTranslationKey
} from '@soliguide/common';
import { ALL_CATEGORIES, type CategorySearch } from '$lib/constants';

/**
 * Get translation key for a category or ALL_CATEGORIES
 * Wrapper around the common function to handle the special ALL_CATEGORIES case
 * Accepts both CategorySearch and string to handle values from URL params
 * Returns empty string if category is null to display empty input field
 */
export const getCategorySearchTranslationKey = (
  category: CategorySearch | string | null
): string => {
  if (!category) {
    return '';
  }

  if (category === ALL_CATEGORIES) {
    return 'ALL_CATEGORIES';
  }

  return getCommonCategoryTranslationKey(category as Categories);
};
