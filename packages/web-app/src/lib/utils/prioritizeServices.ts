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
import {
  Categories,
  ROOT_CATEGORIES,
  type CommonNewPlaceService,
  type FlatCategoriesTreeNode
} from '@soliguide/common';

const CATEGORY_WEIGHTS = {
  SAME_CATEGORY: 0,
  // Notice that it works only if a place have less than 99 services. The weight value should be increased if needed
  SAME_PARENT: 100,
  SAME_GRANDPARENT: 1000,
  DIFFERENT_FAMILY: 10000
};

/**
 * Find parent category of a given category
 */
const findImmediateParent = (
  category: Categories | null,
  categoriesFromTheme: FlatCategoriesTreeNode[]
): Categories | null => {
  const isRootCategories = ROOT_CATEGORIES.some((root) => root.id === category);

  if (isRootCategories) return category;

  const parent = categoriesFromTheme.find((cat) =>
    cat.children.some((child) => child.id === category)
  );
  if (!parent) {
    throw new Error(`Category ${category} doesn't exist`);
  }

  return parent.id;
};

/**
 * Calculates the additional weight based on the relationship between categories
 */
const calculateAdditionalWeight = (
  serviceCategory: Categories,
  targetCategory: Categories,
  allCategoriesByTheme: FlatCategoriesTreeNode[]
) => {
  if (serviceCategory === targetCategory) {
    return CATEGORY_WEIGHTS.SAME_CATEGORY;
  }

  const serviceParent = findImmediateParent(serviceCategory, allCategoriesByTheme);
  const targetParent = findImmediateParent(targetCategory, allCategoriesByTheme);

  if (serviceParent === targetParent) return CATEGORY_WEIGHTS.SAME_PARENT;

  // Look for grand parents
  const serviceGrandParent = findImmediateParent(serviceParent, allCategoriesByTheme);
  const targetGrandParent = findImmediateParent(targetParent, allCategoriesByTheme);

  // Same grand parents (only in Health case)
  if (serviceCategory && serviceGrandParent === targetGrandParent)
    return CATEGORY_WEIGHTS.SAME_GRANDPARENT;

  return CATEGORY_WEIGHTS.DIFFERENT_FAMILY;
};

/**
 * Sort services by relevance based on the category searched by the user
 */
const sortServicesByRelevance = (
  services: CommonNewPlaceService[],
  category: Categories,
  allCategoriesByTheme: FlatCategoriesTreeNode[]
): CommonNewPlaceService[] => {
  return (
    // eslint-disable-next-line fp/no-mutating-methods
    services
      .map((service, index) => ({
        ...service,
        weight:
          index +
          calculateAdditionalWeight(service.category as Categories, category, allCategoriesByTheme)
      }))
      .sort((service1, service2) => service1.weight - service2.weight)
      .map(
        (service) =>
          Object.fromEntries(
            Object.entries(service).filter(([key]) => key !== 'weight')
          ) as CommonNewPlaceService
      )
  );
};
export { sortServicesByRelevance };
