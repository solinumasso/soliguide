import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AutoCompleteType,
  Categories,
  CountryCodes,
  SupportedLanguagesCode,
  Themes,
  type FormattedSuggestion
} from '@soliguide/common';
import { getCategoryService, getCategoryServiceForTheme } from './categoryService';
import { loadSuggestionsData } from './searchSuggestionsData';

vi.mock('./searchSuggestionsData');

const suggestionsData: FormattedSuggestion[] = [
  {
    categoryId: Categories.HYGIENE_PRODUCTS,
    label: "Produits d'hygiène",
    slug: 'produits-hygiene',
    synonyms: ['savon', 'shampoing', 'dentifrice'],
    type: AutoCompleteType.CATEGORY,
    lang: SupportedLanguagesCode.FR,
    country: CountryCodes.FR,
    seoTitle: 'HYGIENE_PRODUCTS',
    seoDescription: ''
  },
  {
    categoryId: Categories.DIGITAL_TOOLS_TRAINING,
    label: 'Formation numérique',
    slug: 'formation-numerique',
    synonyms: ['informatique', 'ordinateur'],
    type: AutoCompleteType.CATEGORY,
    lang: SupportedLanguagesCode.FR,
    country: CountryCodes.FR,
    seoTitle: 'DIGITAL_TOOLS_TRAINING',
    seoDescription: ''
  }
];

describe('Category Service', () => {
  let service = getCategoryService(Themes.SOLIGUIDE_FR);

  beforeEach(() => {
    vi.mocked(loadSuggestionsData).mockResolvedValue(suggestionsData);
    service = getCategoryService(Themes.SOLIGUIDE_FR);
  });

  describe('getCategorySuggestions', () => {
    it('I get category suggestions with a search term', async () => {
      const result = await service.getCategorySuggestions(
        'hygiène',
        'fr',
        SupportedLanguagesCode.FR
      );
      expect(result.some((_service) => _service.categoryId === Categories.HYGIENE_PRODUCTS)).toBe(
        true
      );
      expect(result[0]).toHaveProperty('label');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('type', AutoCompleteType.CATEGORY);
    });

    it('I get no category suggestion with an empty search term', async () => {
      const result = await service.getCategorySuggestions('', 'fr', SupportedLanguagesCode.FR);
      expect(result).toEqual([]);
    });

    it('I get category suggestions matching a synonym', async () => {
      const result = await service.getCategorySuggestions('savon', 'fr', SupportedLanguagesCode.FR);
      expect(result.some((_service) => _service.categoryId === Categories.HYGIENE_PRODUCTS)).toBe(
        true
      );
    });

    it('Returns empty array when no match', async () => {
      const result = await service.getCategorySuggestions(
        'zzzzzzzzz',
        'fr',
        SupportedLanguagesCode.FR
      );
      expect(result).toEqual([]);
    });
  });

  describe('getCategorySuggestionsById', () => {
    it('returns the suggestion(s) matching a known category id', async () => {
      const result = await service.getCategorySuggestionsById(
        Categories.HYGIENE_PRODUCTS,
        'fr',
        SupportedLanguagesCode.FR
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((item) => item.categoryId === Categories.HYGIENE_PRODUCTS)).toBe(true);
      expect(result[0]).toHaveProperty('type', AutoCompleteType.CATEGORY);
    });

    it('returns an empty array for an unknown category id', async () => {
      const result = await service.getCategorySuggestionsById(
        'not-a-real-category',
        'fr',
        SupportedLanguagesCode.FR
      );
      expect(result).toEqual([]);
    });
  });
});

describe('getCategoryServiceForTheme', () => {
  it('serves a taxonomy per theme', () => {
    // Every theme shares the same roots; the per-theme overlay adds children
    const frenchCourses = getCategoryServiceForTheme(Themes.SOLIGUIDE_FR).getChildrenCategories(
      Categories.TRAINING_AND_JOBS
    );
    const spanishCourses = getCategoryServiceForTheme(Themes.SOLIGUIA_ES).getChildrenCategories(
      Categories.TRAINING_AND_JOBS
    );

    expect(frenchCourses).toContain(Categories.FRENCH_COURSE);
    expect(frenchCourses).not.toContain(Categories.CATALAN_COURSE);

    expect(spanishCourses).toContain(Categories.CATALAN_COURSE);
    expect(spanishCourses).toContain(Categories.SPANISH_COURSE);
    expect(spanishCourses).not.toContain(Categories.FRENCH_COURSE);
  });

  it('reuses the same instance for a given theme', () => {
    expect(getCategoryServiceForTheme(Themes.SOLIGUIA_AD)).toBe(
      getCategoryServiceForTheme(Themes.SOLIGUIA_AD)
    );
  });

  it('keeps each theme intact when several are interleaved', () => {
    // One Node process serves every country, so asking for one theme must never
    // change what another one answers
    const frenchService = getCategoryServiceForTheme(Themes.SOLIGUIDE_FR);
    const frenchCoursesBefore = frenchService.getChildrenCategories(Categories.TRAINING_AND_JOBS);

    getCategoryServiceForTheme(Themes.SOLIGUIA_ES).getChildrenCategories(
      Categories.TRAINING_AND_JOBS
    );
    getCategoryServiceForTheme(Themes.SOLIGUIA_AD).getChildrenCategories(
      Categories.TRAINING_AND_JOBS
    );

    expect(frenchService.getChildrenCategories(Categories.TRAINING_AND_JOBS)).toEqual(
      frenchCoursesBefore
    );
    expect(
      getCategoryServiceForTheme(Themes.SOLIGUIDE_FR).getChildrenCategories(
        Categories.TRAINING_AND_JOBS
      )
    ).toEqual(frenchCoursesBefore);
  });
});
