import { RootQuerySelector } from "mongoose";

import {
  Categories,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
  ApiPlace,
  CategoriesService,
  UserStatus,
} from "@soliguide/common";

import { UserPopulateType } from "../../../_models";

export const parseCategories = (
  categoryService: CategoriesService,
  categories: Categories[],
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserPopulateType,
  admin = false,
  categoriesToExclude: Categories[] = [],
  isUserAdmin = false
) => {
  if (
    !categories.length &&
    user.status === UserStatus.API_USER &&
    user.categoriesLimitations?.length
  ) {
    categories = user.categoriesLimitations;
  }

  if (!admin) {
    categoriesToExclude = DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION;
  }

  categoriesToExclude = categoriesToExclude.filter(
    (categoryToExclude: Categories) => !categories.includes(categoryToExclude)
  );

  const leafCategoriesToExclude =
    categoryService.getFlatLeavesFromRootCategories(categoriesToExclude);

  let categoriesToSearch = categoryService
    .getFlatLeavesFromRootCategories(categories)
    .filter(
      (category: Categories) => !leafCategoriesToExclude.includes(category)
    );

  if (
    user.status === UserStatus.API_USER &&
    user.categoriesLimitations?.length
  ) {
    const leafCategoriesLimitations =
      categoryService.getFlatLeavesFromRootCategories(
        user.categoriesLimitations
      );

    categoriesToSearch = categoriesToSearch.filter(
      (categoryToSearch: Categories) =>
        leafCategoriesLimitations.includes(categoryToSearch)
    );
  }

  if (categories.length) {
    nosqlQuery.services_all.$elemMatch.category = {
      $in: categoriesToSearch,
    };
  } else {
    if (
      leafCategoriesToExclude.length &&
      nosqlQuery.$or &&
      nosqlQuery.$or.length > 1 &&
      nosqlQuery.$or[1].$and
    ) {
      // Default search
      nosqlQuery.$or[0].services_all.$elemMatch.category = {
        $nin: leafCategoriesToExclude,
      };

      nosqlQuery.$or[1].$and.push({
        services_all: {
          $elemMatch: { category: { $nin: leafCategoriesToExclude } },
        },
      });

      // Specific rule for administrators who can search places which don't have any service
      if (isUserAdmin) {
        const lastCond = nosqlQuery.$or[1].$and.length - 1;
        nosqlQuery.$or[1].$and[lastCond] = {
          $or: [
            nosqlQuery.$or[1].$and[lastCond],
            {
              services_all: { $size: 0 },
            },
          ],
        };
      }
    }
  }
};
