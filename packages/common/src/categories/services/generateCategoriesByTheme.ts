import cloneDeep from "lodash.clonedeep";
import { Themes } from "../../themes";
import {
  CATEGORIES,
  CATEGORIES_SOLIGUIDE_FR,
  CATEGORIES_SOLIGUIA_ES,
  CATEGORIES_SOLIGUIA_AD,
} from "../constants";
import { Categories } from "../enums";
import { FlatCategoriesTreeNode } from "../interfaces";
import { sortByRank } from "./categories.service";

const mergeCategories = (
  categories: FlatCategoriesTreeNode[],
  categoriesToMerge: FlatCategoriesTreeNode[]
): FlatCategoriesTreeNode[] => {
  const categoriesMap = new Map<Categories, FlatCategoriesTreeNode>();

  for (const category of categories) {
    categoriesMap.set(category.id, category);
  }

  for (const categoryToMerge of categoriesToMerge) {
    const existingCategory = categoriesMap.get(categoryToMerge.id);

    if (existingCategory) {
      existingCategory.children = sortByRank([
        ...existingCategory.children,
        ...categoryToMerge.children,
      ]);
    } else {
      categoriesMap.set(categoryToMerge.id, categoryToMerge);
    }
  }

  return Array.from(categoriesMap.values());
};

export const generateCategoriesByTheme = (
  theme: Themes | null = null
): FlatCategoriesTreeNode[] => {
  const baseCategories = cloneDeep(CATEGORIES);

  if (theme === Themes.SOLIGUIA_ES) {
    return getSpanishCategories();
  }
  if (theme === Themes.SOLIGUIA_AD) {
    return getAndorraCategories();
  }

  return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIDE_FR));
};

export const getSpanishCategories = (): FlatCategoriesTreeNode[] => {
  const baseCategories = cloneDeep(CATEGORIES);
  return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIA_ES));
};

export const getAndorraCategories = (): FlatCategoriesTreeNode[] => {
  const baseCategories = cloneDeep(CATEGORIES);
  return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIA_AD));
};
