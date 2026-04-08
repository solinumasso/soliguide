import { initializeCategoriesApiByTheme } from '@soliguide/common';
import { categories as apiCategories } from '../../../../api/schema/2026-03-03/search.response/category';
import { SearchContext, SearchQueryBuilder } from './search.query-builder';
import { appendAndConditions } from './utils';

export class CategoriesQueryBuilder implements SearchQueryBuilder {
  private readonly validResponseCategories = new Set(apiCategories);
  private readonly categoriesService: MongoCategoriesService;

  constructor() {
    this.categoriesService = initializeCategoriesApiByTheme(null);
  }

  build(context: SearchContext): SearchContext {
    const categories = context.query.categories;
    if (!categories?.length) {
      return context;
    }

    const normalizedCategories = categories.filter(
      (category): category is string => Boolean(category),
    );

    if (!normalizedCategories.length) {
      return context;
    }

    const categorySet = this.expandCategories(normalizedCategories);
    if (categorySet.size === 0) {
      return context;
    }

    return appendAndConditions(context, [
      {
        services_all: {
          $elemMatch: {
            category: {
              $in: [...categorySet],
            },
          },
        },
      },
    ]);
  }

  private expandCategories(categories: string[]): Set<string> {
    if (!this.categoriesService) {
      return new Set(
        categories.filter((category) =>
          this.validResponseCategories.has(category),
        ),
      );
    }

    const allCategoryIds = new Set(
      this.categoriesService
        .getCategories()
        .map((categoryNode) => categoryNode.id),
    );

    const expandedCategories = new Set<string>();

    for (const requestedCategory of categories) {
      if (allCategoryIds.has(requestedCategory)) {
        const leafCategories =
          this.categoriesService.getFlatLeavesFromRootCategories([
            requestedCategory,
          ]);

        for (const leafCategory of leafCategories) {
          if (this.validResponseCategories.has(leafCategory)) {
            expandedCategories.add(leafCategory);
          }
        }
      } else if (this.validResponseCategories.has(requestedCategory)) {
        expandedCategories.add(requestedCategory);
      }
    }

    return expandedCategories;
  }
}

type MongoCategoriesService = {
  getCategories(): Array<{ id: string }>;
  getFlatLeavesFromRootCategories(categories: string[]): string[];
};
