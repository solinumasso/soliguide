import { SearchController } from './search.controller';
import { SearchService } from '../search/search.service';
import { type SearchQuery, type SearchResponse } from '../search/search.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const currentResponse: SearchResponse = {
  _links: {
    self: { href: '/search?page=1&limit=20' },
    next: null,
    prev: null,
  },
  results: [],
  page: {
    current: 1,
    limit: 20,
    totalPages: 1,
    totalResults: 0,
  },
};

describe('SearchController', () => {
  const mockSearchService = {
    search: vi.fn<(query: SearchQuery) => Promise<SearchResponse>>(),
  };

  let controller: SearchController;

  beforeEach(() => {
    mockSearchService.search.mockReset();
    mockSearchService.search.mockResolvedValue(currentResponse);
    controller = new SearchController(
      mockSearchService as unknown as SearchService,
    );
  });

  it('delegates canonical query payload to SearchService', async () => {
    const canonicalQuery: SearchQuery = {
      locationMode: 'country',
      country: 'FR',
      openToday: true,
      page: 2,
      limit: 10,
    };

    await controller.search(canonicalQuery);

    expect(mockSearchService.search).toHaveBeenCalledTimes(1);
    expect(mockSearchService.search).toHaveBeenCalledWith(canonicalQuery);
  });

  it('returns SearchService canonical response unchanged', async () => {
    const canonicalQuery: SearchQuery = {
      locationMode: 'country',
      country: 'FR',
    };

    await expect(controller.search(canonicalQuery)).resolves.toEqual(
      currentResponse,
    );
  });
});
