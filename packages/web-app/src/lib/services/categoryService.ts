import { env } from '$env/dynamic/public';
import {
  CategoriesService,
  Categories,
  type FlatCategoriesTreeNode,
  type SearchSuggestion,
  Themes,
  SupportedLanguagesCode
} from '@soliguide/common';
import { fetch } from '$lib/client';
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
  fetcher: Fetcher<SearchSuggestion[]> = fetch
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
   * Now uses the new search-suggestions endpoint with country and language support.
   */
  const getCategorySuggestions = async (
    searchTerm: string,
    country: string,
    lang: SupportedLanguagesCode
  ): Promise<Categories[]> => {
    try {
      if (searchTerm.length === 0) {
        return [];
      }

      const url = `${apiUrl}/new-search/search-suggestions/${country}/${lang}/${encodeURI(searchTerm.trim())}/categories`;

      const result: SearchSuggestion[] = await fetcher(url);

      // Filter and extract only the categoryId values
      return result.map((item) => item.categoryId).filter((id): id is Categories => id !== null);
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
