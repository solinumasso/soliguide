import { Categories } from '@soliguide/common';
import { type Writable } from 'svelte/store';
import type { PosthogCaptureFunction } from '$lib/services/types';
import type { CategorySearch } from '$lib/constants';

export enum CategoryBrowserState {
  CLOSED = 'closed',
  OPEN_ROOT_CATEGORIES = 'open with root categories',
  OPEN_CATEGORY_DETAIL = 'open with a category detail'
}

export interface PageState {
  categoryButtons: Categories[];
  parentCategory: Categories | null;
  categories: Categories[];
  browserState: CategoryBrowserState;
  selectedCategory: CategorySearch | null;
  navigationStack: Categories[];
}

export interface CategorySelectorController {
  subscribe: Writable<PageState>['subscribe'];
  openCategoryBrowser(): void;
  navigateToDetail(categoryId: Categories): void;
  navigateBack(): void;
  selectCategory(categoryId: CategorySearch): void;
  init(): void;
}

export interface CategoryBrowserController {
  captureEvent: PosthogCaptureFunction;
}
