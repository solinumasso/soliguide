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
import { env } from '$env/dynamic/public';
import {
  CategoriesService,
  Categories,
  type FlatCategoriesTreeNode,
  type SearchAutoComplete,
  Themes
} from '@soliguide/common';
import { fetch } from '$lib/client';
import { buildCategorySuggestion } from '$lib/models/categorySuggestion';
import type { Fetcher } from '$lib/client/types';
import { CategoriesErrors, type CategoryService } from './types';
import { get } from 'svelte/store';
import { themeStore } from '$lib/theme';

const apiUrl = env.PUBLIC_API_URL;

type ParentToChildren = Record<Categories, Categories[]>;

/**
 * Associates each category id with its children ids
 * in an object for easy access
 */
const buildParentToChildrenStructure = (categories: FlatCategoriesTreeNode[]): ParentToChildren => {
  return categories.reduce((acc: ParentToChildren, category: FlatCategoriesTreeNode) => {
    // Keep only the ids
    return { ...acc, [category.id]: category.children.map((child) => child.id) };
  }, {} as ParentToChildren);
};

/**
 * Remove specialists and  HEALTH_SPECIALISTS's children in global structure
 */
const removeSpecialistsFromCategories = (
  categories: FlatCategoriesTreeNode[]
): FlatCategoriesTreeNode[] => {
  const specialistsParentNode = categories.find(
    (category) => category.id === Categories.HEALTH_SPECIALISTS
  );

  if (specialistsParentNode) {
    const specialists = specialistsParentNode.children.map((child) => child.id);
    return categories
      .map((category) => ({
        ...category,
        children: category.id === Categories.HEALTH_SPECIALISTS ? [] : category.children
      }))
      .filter((category) => !specialists.includes(category.id));
  }
  return [...categories];
};

/**
 * This service proxies the @soliguide/common category.service
 * and provides ad hoc functions and data
 *
 * Gets the category service
 */
export const getCategoryService = (
  currentThemeName: Themes,
  fetcher: Fetcher<SearchAutoComplete> = fetch
): CategoryService => {
  const categoriesService = new CategoriesService(currentThemeName);

  const allCategories = categoriesService.getCategories();
  const categoriesWithoutSpecialists = removeSpecialistsFromCategories(allCategories);
  const parentToChildren = buildParentToChildrenStructure(categoriesWithoutSpecialists);

  const getAllCategories = (): FlatCategoriesTreeNode[] => {
    return allCategories;
  };

  /**
   * Checks if a category is a specialty
   */
  const isSpecialist = (categoryId: Categories): boolean => {
    return !categoriesWithoutSpecialists.find(({ id }) => id === categoryId);
  };

  const getRootCategories = (): Categories[] => {
    return categoriesService.getOrderRootCategoriesIds();
  };

  /**
   * Finds direct child category ids given a parent
   */
  const getChildrenCategories = (categoryId: Categories): Categories[] => {
    return parentToChildren[categoryId];
  };

  const isCategoryRoot = (categoryId: Categories): boolean => {
    return categoriesService.getOrderRootCategoriesIds().includes(categoryId);
  };

  /**
   * Auto-complete feature for categories. All apseiclists are filtered from the results
   */
  const getCategorySuggestions = async (searchTerm: string): Promise<Categories[]> => {
    try {
      if (searchTerm.length === 0) {
        return [];
      }

      const url = `${apiUrl}new-search/auto-complete/${encodeURI(searchTerm.trim())}`;

      const result = await fetcher(url);
      return buildCategorySuggestion(result, isSpecialist);
    } catch {
      throw CategoriesErrors.ERROR_SERVER;
    }
  };

  return {
    getAllCategories,
    getRootCategories,
    getChildrenCategories,
    isCategoryRoot,
    getCategorySuggestions
  };
};

const themeName = get(themeStore.getTheme()).name;
export const categoryService = getCategoryService(themeName, fetch);
