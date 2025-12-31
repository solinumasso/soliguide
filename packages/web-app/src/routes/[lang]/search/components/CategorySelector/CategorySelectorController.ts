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
import { get, writable } from 'svelte/store';
import { Categories } from '@soliguide/common';
import type { CategoryService } from '$lib/services/types';
import { CategoryBrowserState, type CategorySelectorController, type PageState } from './types';
import { locationService } from '$lib/services';
import { getSearchPageController } from '../../pageController';
import { type CategorySearch } from '$lib/constants';

/**
 * Returns an instance of the service
 */
export const getCategorySelectorController = (
  categoryService: CategoryService
): CategorySelectorController => {
  const initialState: PageState = {
    categoryButtons: [Categories.FOOD, Categories.COUNSELING, Categories.WELCOME],
    parentCategory: null,
    categories: [],
    browserState: CategoryBrowserState.CLOSED,
    selectedCategory: null,
    navigationStack: []
  };

  const pageStore = writable(initialState);

  const searchController = getSearchPageController(locationService, categoryService);

  const openCategoryBrowser = () => {
    searchController.captureEvent('all-category');

    pageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        browserState: CategoryBrowserState.OPEN_ROOT_CATEGORIES,
        parentCategory: null,
        selectedCategory: null,
        categories: categoryService.getRootCategories(),
        navigationStack: []
      })
    );
  };

  /**
   * Get the children of the category to display them.
   * Supports navigation at any level (root, level 2, level 3, etc.)
   */
  const navigateToDetail = (categoryId: Categories) => {
    pageStore.update((oldValue): PageState => {
      // Check if the category has children
      const categoryHasChildren = categoryService.hasChildren(categoryId);
      if (!categoryHasChildren) {
        return oldValue;
      }

      // Add current parent to navigation stack if exists
      const newStack = oldValue.parentCategory
        ? [...oldValue.navigationStack, oldValue.parentCategory]
        : oldValue.navigationStack;

      return {
        ...oldValue,
        browserState: CategoryBrowserState.OPEN_CATEGORY_DETAIL,
        parentCategory: categoryId,
        categories: categoryService.getChildrenCategories(categoryId),
        navigationStack: newStack
      };
    });
  };

  /**
   * Go back in the navigation hierarchy:
   * - If in OPEN_ROOT_CATEGORIES: close the browser
   * - If in OPEN_CATEGORY_DETAIL with empty stack: go back to root categories
   * - If in OPEN_CATEGORY_DETAIL with items in stack: go back to previous category
   */
  const navigateBack = () => {
    pageStore.update((oldValue): PageState => {
      // If we're showing root categories, close the browser
      if (oldValue.browserState === CategoryBrowserState.OPEN_ROOT_CATEGORIES) {
        return {
          ...oldValue,
          browserState: CategoryBrowserState.CLOSED,
          parentCategory: null,
          categories: [],
          navigationStack: []
        };
      }

      // If we're in category detail
      if (oldValue.browserState === CategoryBrowserState.OPEN_CATEGORY_DETAIL) {
        // If stack is empty, go back to root categories
        if (oldValue.navigationStack.length === 0) {
          return {
            ...oldValue,
            browserState: CategoryBrowserState.OPEN_ROOT_CATEGORIES,
            parentCategory: null,
            categories: categoryService.getRootCategories(),
            navigationStack: []
          };
        }

        // If stack has items, get the last one and navigate to it
        const previousCategory = oldValue.navigationStack[oldValue.navigationStack.length - 1];
        const newStack = oldValue.navigationStack.slice(0, -1);

        return {
          ...oldValue,
          browserState: CategoryBrowserState.OPEN_CATEGORY_DETAIL,
          parentCategory: previousCategory,
          categories: categoryService.getChildrenCategories(previousCategory),
          navigationStack: newStack
        };
      }

      return oldValue;
    });
  };

  const selectCategory = (categoryId: CategorySearch) => {
    const isFromBrowser = get(pageStore).browserState !== CategoryBrowserState.CLOSED;

    searchController.captureEvent(isFromBrowser ? 'select-category' : 'select-showcased-category', {
      categorySelected: categoryId
    });

    pageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        browserState: CategoryBrowserState.CLOSED,
        parentCategory: null,
        categories: [],
        selectedCategory: categoryId,
        navigationStack: []
      })
    );
  };

  const init = (): void => pageStore.set(initialState);

  return {
    subscribe: pageStore.subscribe,
    openCategoryBrowser,
    navigateToDetail,
    navigateBack,
    selectCategory,
    init
  };
};
