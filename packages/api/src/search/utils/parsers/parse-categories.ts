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
import { RootQuerySelector } from "mongoose";

import {
  Categories,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
  ApiPlace,
  CategoriesService,
  UserStatus,
} from "@soliguide/common";
import { UserForSearch } from "../../../user/types";

export const parseCategories = (
  categoryService: CategoriesService,
  categories: Categories[],
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserForSearch,
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
