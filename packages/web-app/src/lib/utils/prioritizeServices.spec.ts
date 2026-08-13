import { describe, expect, it } from 'vitest';
import { Categories, CommonNewPlaceService, Themes } from '@soliguide/common';
import { sortServicesByRelevance } from './prioritizeServices';
import { getCategoryService } from '$lib/services/categoryService';

const categoriesThemeFr = getCategoryService(Themes.SOLIGUIDE_FR).getAllCategories();
const categoriesThemeEs = getCategoryService(Themes.SOLIGUIA_ES).getAllCategories();
const categoriesThemeAd = getCategoryService(Themes.SOLIGUIA_AD).getAllCategories();

describe('Prioritize the order of services based on a given category.', () => {
  it('Category searched by user should be first in the list', () => {
    const categorySearchedByUser = Categories.FOOD_PACKAGES;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING },
      { category: Categories.FOOD_PACKAGES }
    ];

    const expected = [
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });

  it('Category with same parents should be first in the list', () => {
    const categorySearchedByUser = Categories.FOOD_PACKAGES;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.DAY_HOSTING }
    ];

    const expected = [
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });

  it('Categories with the same parents than the category searched by user must be listing in first by order', () => {
    const categorySearchedByUser = Categories.COOKING_WORKSHOP;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.DAY_HOSTING }
    ];

    const expected = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });

  it('When searching for a root category, priority should be given to its direct children', () => {
    const categorySearchedByUser = Categories.FOOD;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.DAY_HOSTING }
    ];

    const expected = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.FOOD_PACKAGES },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });

  it('A search for a Specialist category should navigate through the full category hierarchy', () => {
    const categorySearchedByUser = Categories.GYNECOLOGY;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.GYNECOLOGY },
      { category: Categories.CONTRACEPTION }
    ];

    const expected = [
      { category: Categories.GYNECOLOGY },
      { category: Categories.CONTRACEPTION },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.FOOD_DISTRIBUTION },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.DAY_HOSTING }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });
});

describe('Prioritize the order of services based on a given category and theme', () => {
  it('Should be able to sort with French Course category if theme is soliguide_fr ', () => {
    const categorySearchedByUser = Categories.FRENCH_COURSE;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.FRENCH_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const expected = [
      { category: Categories.FRENCH_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeFr
    );

    expect(result).toEqual(expected);
  });

  it('Should be able to sort with Spanish and Catalan Courses categories if theme is soliguide_es', () => {
    const categorySearchedByUser = Categories.SPANISH_COURSE;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.SPANISH_COURSE },
      { category: Categories.CATALAN_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const expected = [
      { category: Categories.SPANISH_COURSE },
      { category: Categories.CATALAN_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeEs
    );

    expect(result).toEqual(expected);
  });

  it('Should be able to sort with Spanish and Catalan Courses categories if theme is soliguide_ad', () => {
    const categorySearchedByUser = Categories.CATALAN_COURSE;

    const services: Partial<CommonNewPlaceService>[] = [
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.SPANISH_COURSE },
      { category: Categories.CATALAN_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const expected = [
      { category: Categories.CATALAN_COURSE },
      { category: Categories.SPANISH_COURSE },
      { category: Categories.JOB_COACHING },
      { category: Categories.BUDGET_ADVICE },
      { category: Categories.ADDICTION_PREVENTION_AND_MATERIAL },
      { category: Categories.DAY_HOSTING },
      { category: Categories.PREGNANCY_CARE }
    ];

    const result = sortServicesByRelevance(
      services as CommonNewPlaceService[],
      categorySearchedByUser,
      categoriesThemeAd
    );

    expect(result).toEqual(expected);
  });
});

describe('Services whose category is absent from the current theme', () => {
  /**
   * Each country has its own taxonomy, and a search radius can cross a border:
   * an Andorran search returns French places whose services use FR only
   * categories. Those must sort last, never break the search.
   */
  const andorranCategories = categoriesThemeAd;

  const buildService = (category: string) =>
    ({ category, description: '' }) as unknown as CommonNewPlaceService;

  it('does not throw on a category the theme does not declare', () => {
    expect(() =>
      sortServicesByRelevance(
        [buildService(Categories.FRENCH_COURSE)],
        Categories.FOOD,
        andorranCategories
      )
    ).not.toThrow();
  });

  it('keeps every service in the result', () => {
    const services = [
      buildService(Categories.FRENCH_COURSE),
      buildService(Categories.FOOD_DISTRIBUTION)
    ];

    const result = sortServicesByRelevance(services, Categories.FOOD, andorranCategories);

    expect(result).toHaveLength(2);
  });

  it('sorts the unknown category after the relevant one', () => {
    const services = [
      buildService(Categories.FRENCH_COURSE),
      buildService(Categories.FOOD_DISTRIBUTION)
    ];

    const result = sortServicesByRelevance(services, Categories.FOOD, andorranCategories);

    expect(result[0].category).toBe(Categories.FOOD_DISTRIBUTION);
    expect(result[1].category).toBe(Categories.FRENCH_COURSE);
  });

  it('does not treat two unknown categories as siblings', () => {
    const result = sortServicesByRelevance(
      [buildService(Categories.FRENCH_COURSE)],
      Categories.CITIZEN_HOUSING,
      andorranCategories
    );

    expect(result).toHaveLength(1);
  });
});
