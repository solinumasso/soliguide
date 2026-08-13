import { locationService } from '$lib/services';
import type { CategoryService } from '$lib/services/types';
import { getSearchPageController } from './pageController';

/**
 * The controller cannot be a module level singleton: it holds the category
 * service, whose taxonomy depends on the country of the current request.
 */
export const createSearchPageController = (categoryService: CategoryService) =>
  getSearchPageController(locationService, categoryService);
