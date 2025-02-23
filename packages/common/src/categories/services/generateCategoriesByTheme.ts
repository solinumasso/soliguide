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

  if (theme === Themes.SOLIGUIDE_FR) {
    return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIDE_FR));
  }
  if (theme === Themes.SOLIGUIA_ES) {
    return getSpanishCategories();
  }
  if (theme === Themes.SOLIGUIA_AD) {
    return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIA_AD));
  }
  // --------------------------------------------------------------
  // !!! Actually CATEGORIES_SOLIGUIA_ES === CATEGORIES_SOLIGUIA_AD
  // If changes => add CATEGORIES_SOLIGUIA_AD in merge
  // --------------------------------------------------------------
  return mergeCategories(
    mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIDE_FR)),
    cloneDeep(CATEGORIES_SOLIGUIA_ES)
  );
};

export const getSpanishCategories = (): FlatCategoriesTreeNode[] => {
  const CATEGORIES_SOLIGUIA_ES: FlatCategoriesTreeNode[] = [
    {
      id: Categories.TRAINING_AND_JOBS,
      children: [
        {
          id: Categories.SPANISH_COURSE,
          rank: 130,
        },
        {
          id: Categories.CATALAN_COURSE,
          rank: 170,
        },
      ],
    },
    {
      id: Categories.SPANISH_COURSE,
      children: [],
    },
    {
      id: Categories.CATALAN_COURSE,
      children: [],
    },
  ];

  const baseCategories = cloneDeep(CATEGORIES);
  return mergeCategories(baseCategories, cloneDeep(CATEGORIES_SOLIGUIA_ES));
};
