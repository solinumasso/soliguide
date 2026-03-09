import { beforeEach, describe, expect, it } from 'vitest';
import {
  AutoCompleteType,
  Categories,
  CountryCodes,
  SupportedLanguagesCode,
  Themes,
  type SearchSuggestion
} from '@soliguide/common';
import { getCategoryService } from './categoryService';
import { fakeFetch } from '$lib/client';
import type { Fetcher } from '$lib/client/types';
import { CategoriesErrors } from './types';

const apiSuggestions: SearchSuggestion[] = [
  {
    sourceId: 'hygiene_products',
    lang: SupportedLanguagesCode.FR,
    label: "Produits d'hygiène",
    categoryId: Categories.HYGIENE_PRODUCTS,
    slug: 'produits-hygiene',
    country: CountryCodes.FR,
    synonyms: [],
    type: AutoCompleteType.CATEGORY,
    content: '',
    seoTitle: 'HYGIENE_PRODUCTS',
    seoDescription: '',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceId: 'digital_tools_training',
    lang: SupportedLanguagesCode.FR,
    label: 'Formation numérique',
    categoryId: Categories.DIGITAL_TOOLS_TRAINING,
    slug: 'formation-numerique',
    country: CountryCodes.FR,

    synonyms: [],
    type: AutoCompleteType.CATEGORY,
    content: '',
    seoTitle: 'DIGITAL_TOOLS_TRAINING',
    seoDescription: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const builtSuggestions = ['hygiene_products', 'digital_tools_training'];

describe('Category Service', () => {
  const { fetch, feedWith, setError } = fakeFetch();
  let service = getCategoryService(Themes.SOLIGUIDE_FR);

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = getCategoryService(Themes.SOLIGUIDE_FR, fetch as Fetcher<any>);
    feedWith([]);
    setError(null);
  });

  describe('getCategorySuggestions', () => {
    it('I get category suggestions with a search term', async () => {
      feedWith(apiSuggestions);
      const result = await service.getCategorySuggestions('abc', 'fr', 'fr');
      expect(result).toEqual(builtSuggestions);
    });

    it('I get no category suggestion with an empty search term', async () => {
      feedWith(apiSuggestions);
      const result = await service.getCategorySuggestions('', 'fr', 'fr');
      expect(result).toEqual([]);
    });

    it('Returns nothing when search has a server error', () => {
      setError({ status: 500, statusText: 'Internal server error' });
      expect(() => service.getCategorySuggestions('bob', 'fr', 'fr')).rejects.toThrowError(
        CategoriesErrors.ERROR_SERVER
      );
    });
  });
});
