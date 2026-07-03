import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Categories, GeoTypes, SupportedLanguagesCode } from '@soliguide/common';
import { fakeFetch } from '$lib/client';
import getSearchService from './placesService';
import type { RequestOptions } from './types';

const searchReqOptions: RequestOptions = {
  origin: 'me',
  referer: 'metoo',
  'X-Ph-User-Session-Id': 'session-id',
  'X-Ph-User-Distinct-Id': 'user-id'
};

describe('Search Service', () => {
  const { fetch, feedWith, setError } = fakeFetch();
  let service = getSearchService();

  beforeEach(() => {
    service = getSearchService(fetch);
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
          options: { page: 1 }
        },
        searchReqOptions
      );
      expect(result).toEqual({ nbResults: 0, places: [] });
    });

    it('Sends filters to the API search route', async () => {
      const fetcher = vi.fn().mockResolvedValue({ nbResults: 0, places: [] });
      service = getSearchService(fetcher);

      await service.search(
        {
          lang: SupportedLanguagesCode.FR,
          location: 'toto',
          category: Categories.FOOD,
          coordinates: [1.234, 8.7654],
          type: GeoTypes.CITY,
          distance: 50,
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
});
