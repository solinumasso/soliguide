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
  const parentToChildren = buildParentToChildrenStructure(allCategories);

  const getAllCategories = (): FlatCategoriesTreeNode[] => {
    return allCategories;
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
   * Checks if a category has children
   */
  const hasChildren = (categoryId: Categories): boolean => {
    return categoriesService.hasChildren(categoryId);
  };

  /**
   * Auto-complete feature for categories.
   */
  const getCategorySuggestions = async (searchTerm: string): Promise<Categories[]> => {
    try {
      if (searchTerm.length === 0) {
        return [];
      }

      const url = `${apiUrl}new-search/auto-complete/${encodeURI(searchTerm.trim())}`;

      const result = await fetcher(url);
      return buildCategorySuggestion(result);
    } catch {
      throw CategoriesErrors.ERROR_SERVER;
    }
  };

  return {
    getAllCategories,
    getRootCategories,
    getChildrenCategories,
    isCategoryRoot,
    hasChildren,
    getCategorySuggestions
  };
};

const themeName = get(themeStore.getTheme()).name;

export const categoryService = getCategoryService(themeName, fetch);
