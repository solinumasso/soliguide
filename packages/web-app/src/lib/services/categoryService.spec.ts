import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AutoCompleteType,
  Categories,
  CountryCodes,
  SupportedLanguagesCode,
  Themes,
  type FormattedSuggestion
} from '@soliguide/common';
import { getCategoryService } from './categoryService';

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

vi.mock('./searchSuggestionsData', () => ({
  loadSuggestionsData: vi.fn().mockResolvedValue(suggestionsData)
}));

describe('Category Service', () => {
  let service = getCategoryService(Themes.SOLIGUIDE_FR);

  beforeEach(() => {
    service = getCategoryService(Themes.SOLIGUIDE_FR);
  });

  describe('getCategorySuggestions', () => {
    it('I get category suggestions with a search term', async () => {
      const result = await service.getCategorySuggestions(
        'hygiène',
        'fr',
        SupportedLanguagesCode.FR
      );
      expect(result).toContain(Categories.HYGIENE_PRODUCTS);
    });

    it('I get no category suggestion with an empty search term', async () => {
      const result = await service.getCategorySuggestions('', 'fr', SupportedLanguagesCode.FR);
      expect(result).toEqual([]);
    });

    it('I get category suggestions matching a synonym', async () => {
      const result = await service.getCategorySuggestions('savon', 'fr', SupportedLanguagesCode.FR);
      expect(result).toContain(Categories.HYGIENE_PRODUCTS);
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
});
