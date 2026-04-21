import Fuse from 'fuse.js';
import {
  CategoriesService,
  Categories,
  type FlatCategoriesTreeNode,
  type FormattedSuggestion,
  Themes,
  SupportedLanguagesCode,
  AutoCompleteType,
  FUSE_SEARCH_SUGGESTIONS_OPTIONS,
  type SoliguideCountries
} from '@soliguide/common';
import type { CategoryService } from './types';
import { get } from 'svelte/store';
import { themeStore } from '$lib/theme';
import { loadSuggestionsData } from './searchSuggestionsData';

type ParentToChildren = Record<Categories, Categories[]>;

/**
 * Associates each category id with its children ids
 * in an object for easy access
 */
const buildParentToChildrenStructure = (categories: FlatCategoriesTreeNode[]): ParentToChildren => {
  return categories.reduce((acc: ParentToChildren, category: FlatCategoriesTreeNode) => {
    // Keep only the ids
    return {
      ...acc,
      [category.id]: category.children.map((child) => child.id)
    };
  }, {} as ParentToChildren);
};

/**
 * This service proxies the @soliguide/common category.service
 * and provides ad hoc functions and data
 *
 * Gets the category service
 */
export const getCategoryService = (currentThemeName: Themes): CategoryService => {
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

  let fuseCache: { key: string; fuse: Fuse<FormattedSuggestion> } | null = null;

  /**
   * Auto-complete feature for categories.
   * Uses Fuse.js locally with JSON data from @soliguide/common.
   */
  const getCategorySuggestions = async (
    searchTerm: string,
    country: string,
    lang: SupportedLanguagesCode
  ): Promise<Categories[]> => {
    if (searchTerm.length === 0) {
      return [];
    }

    const key = `${country}/${lang}`;
    if (fuseCache?.key !== key) {
      const data = await loadSuggestionsData(country as SoliguideCountries, lang);
      fuseCache = {
        key,
        fuse: new Fuse(data, FUSE_SEARCH_SUGGESTIONS_OPTIONS)
      };
    }

    return fuseCache.fuse
      .search(searchTerm)
      .filter((r) => r.item.type === AutoCompleteType.CATEGORY)
      .map((r) => r.item.categoryId)
      .filter((id): id is Categories => id !== null);
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

export const categoryService = getCategoryService(themeName);
