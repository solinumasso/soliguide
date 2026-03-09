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
