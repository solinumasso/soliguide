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
  category: Categories | null,
  allCategoriesByTheme: FlatCategoriesTreeNode[]
): CommonNewPlaceService[] => {
  if (!category || !Object.values(Categories).includes(category)) {
    return services;
  }

  return (
    // eslint-disable-next-line fp/no-mutating-methods
    services
      .map((service) => ({
        ...service,
        weight: calculateAdditionalWeight(
          service.category as Categories,
          category,
          allCategoriesByTheme
        )
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
