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
