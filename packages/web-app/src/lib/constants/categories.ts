import type { Categories } from '@soliguide/common';

/**
 * Special constant for "all categories" search
 * This value is used internally in the app and converted to null when calling the API
 */
export const ALL_CATEGORIES = 'all_categories' as const;

/**
 * Type representing a category selection in the search interface
 * Can be a real category from the enum or ALL_CATEGORIES for searching everything
 */
export type CategorySearch = Categories | typeof ALL_CATEGORIES;
