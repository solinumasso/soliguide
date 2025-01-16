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
import { beforeEach, describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { Categories, Themes } from '@soliguide/common';
import { getCategorySelectorController } from './CategorySelectorController';
import { CategoryBrowserState, type CategorySelectorController } from './types';
import { getCategoryService } from '$lib/services/categoryService';

describe('Category selector widget', () => {
  // skipcq: JS-0119
  let pageState: CategorySelectorController;
  const service = getCategoryService(Themes.SOLIGUIDE_FR);

  beforeEach(() => {
    pageState = getCategorySelectorController(service);
  });

  describe('When the navigator is not open', () => {
    it('We do not have a list of categories', () => {
      expect(get(pageState).categories.length).toBe(0);
    });

    it('the navigator is not open', () => {
      expect(get(pageState).browserState).toEqual(CategoryBrowserState.CLOSED);
    });

    it('When we click on ALL button, the navigator is opened and we have the list of root categories', () => {
      pageState.openCategoryBrowser();
      expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_ROOT_CATEGORIES);
    });

    it('If I select a category from a button, it is marked selected', () => {
      const category = Categories.COUNSELING;
      pageState.selectCategory(category);
      expect(get(pageState).selectedCategory).toEqual(category);
      expect(get(pageState).browserState).toEqual(CategoryBrowserState.CLOSED); // was already
      expect(get(pageState).categories).toEqual([]);
    });
  });

  describe('When the navigator is opened', () => {
    beforeEach(() => {
      pageState.openCategoryBrowser();
    });

    describe('When I want to go back from the topbar (navigate up/back)', () => {
      it('If I navigate from the root categories page, the navigator is closed', () => {
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_ROOT_CATEGORIES);
        pageState.navigateBack();
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.CLOSED);
      });

      it('If I navigate from a category detail page, the browser stays open and the root categories page is displayed', () => {
        const rootCategory = Categories.FOOD;
        const parentCategories = get(pageState).categories;
        pageState.navigateToDetail(rootCategory);
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_CATEGORY_DETAIL);
        expect(get(pageState).parentCategory).toEqual(rootCategory);
        expect(get(pageState).categories).not.toEqual(parentCategories);
        pageState.navigateBack();
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_ROOT_CATEGORIES);
        expect(get(pageState).categories).toEqual(parentCategories);
      });
    });

    describe('When I click on a category (navigate down)', () => {
      it('If I navigate from the root categories page, I see a new list of categories', () => {
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_ROOT_CATEGORIES);
        const { categories } = get(pageState);
        const category = Categories.FOOD;

        pageState.navigateToDetail(category);
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_CATEGORY_DETAIL);
        expect(get(pageState).categories).not.toEqual(categories);
        expect(get(pageState).parentCategory).toEqual(category);
      });

      it('If I navigate from a category detail page, it has no effect', () => {
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_ROOT_CATEGORIES);

        pageState.navigateToDetail(Categories.FOOD);
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.OPEN_CATEGORY_DETAIL);

        const category = Categories.COOKING_WORKSHOP;
        const previousState = get(pageState);
        pageState.navigateToDetail(category);
        expect(get(pageState)).toEqual(previousState);
      });
    });

    describe('When I select a category', () => {
      it('The browser closes, categories are empty and selectedCategory is the category', () => {
        pageState.navigateToDetail(Categories.FOOD);
        const category = Categories.COOKING_WORKSHOP;
        pageState.selectCategory(category);
        expect(get(pageState).selectedCategory).toEqual(category);
        expect(get(pageState).browserState).toEqual(CategoryBrowserState.CLOSED);
        expect(get(pageState).categories).toEqual([]);
      });
    });
  });
});
