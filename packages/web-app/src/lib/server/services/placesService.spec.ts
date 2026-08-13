import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Categories,
  CountryCodes,
  GeoTypes,
  type SoliguideCountries,
  SupportedLanguagesCode,
  Themes
} from '@soliguide/common';
import { fakeFetch } from '$lib/client';
import getSearchService from './placesService';
import { getCategoryServiceForTheme } from '$lib/services/categoryService';

const categoryService = getCategoryServiceForTheme(Themes.SOLIGUIDE_FR);
import type { RequestOptions } from './types';

const searchReqOptions: RequestOptions = {
  origin: 'me',
  referer: 'metoo',
  'X-Ph-User-Session-Id': 'session-id',
  'X-Ph-User-Distinct-Id': 'user-id'
};

describe('Search Service', () => {
  const { fetch, feedWith, setError } = fakeFetch();
  let service = getSearchService(categoryService);

  beforeEach(() => {
    service = getSearchService(categoryService, fetch);
    feedWith([]);
    setError(null);
  });

  describe('When searching with a location, a category and a theme', () => {
    it('We get data', async () => {
      feedWith({ nbResults: 0, places: [] });
      const result = await service.search(
        {
          lang: SupportedLanguagesCode.FR,
          location: 'toto',
          category: Categories.FOOD,
          coordinates: [1.234, 8.7654],
          type: GeoTypes.CITY,
          distance: 50,
          country: CountryCodes.FR,
          options: { page: 1 }
        },
        searchReqOptions
      );
      expect(result).toEqual({ nbResults: 0, places: [] });
    });

    it('Sends filters to the API search route', async () => {
      const fetcher = vi.fn().mockResolvedValue({ nbResults: 0, places: [] });
      service = getSearchService(categoryService, fetcher);

      await service.search(
        {
          lang: SupportedLanguagesCode.FR,
          location: 'toto',
          category: Categories.FOOD,
          coordinates: [1.234, 8.7654],
          type: GeoTypes.CITY,
          distance: 50,
          country: CountryCodes.FR,
          openToday: true,
          modalities: {
            pmr: true,
            animal: true,
            thermalComfort: { airConditioned: true }
          },
          options: { page: 1 }
        },
        searchReqOptions
      );

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(JSON.parse(fetcher.mock.calls[0][1]?.body as string)).toEqual(
        expect.objectContaining({
          openToday: true,
          modalities: {
            pmr: true,
            animal: true,
            thermalComfort: { airConditioned: true }
          }
        })
      );
      expect(JSON.parse(fetcher.mock.calls[1][1]?.body as string)).toEqual(
        expect.objectContaining({
          openToday: true,
          modalities: {
            pmr: true,
            animal: true,
            thermalComfort: { airConditioned: true }
          }
        })
      );
    });
  });
  describe('Country restriction', () => {
    /**
     * The API derives the country of a search from `location.country` and falls
     * back to France when it is absent, so a Spanish or Andorran search would
     * silently return French places.
     */
    it.each<[string, SoliguideCountries]>([
      ['Andorra', CountryCodes.AD],
      ['Spain', CountryCodes.ES],
      ['France', CountryCodes.FR]
    ])('restricts a %s search to its own country', async (_label, country) => {
      const fetcher = vi.fn().mockResolvedValue({ nbResults: 0, places: [] });
      service = getSearchService(categoryService, fetcher);

      await service.search(
        {
          lang: SupportedLanguagesCode.CA,
          location: 'andorra',
          category: Categories.FOOD,
          coordinates: [1.52, 42.5],
          type: GeoTypes.COUNTRY,
          distance: 10,
          country,
          options: { page: 1 }
        },
        searchReqOptions
      );

      // Both the places query and the itinerary query have to carry it
      expect(fetcher).toHaveBeenCalledTimes(2);
      const sentCountries = fetcher.mock.calls.map(
        (call) => JSON.parse(call[1]?.body as string).location.country
      );
      expect(sentCountries).toEqual([country, country]);
    });
  });
});
