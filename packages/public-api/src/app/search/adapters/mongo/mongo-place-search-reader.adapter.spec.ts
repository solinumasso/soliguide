import { type PlacesDatabaseService } from './places-database.service';
import { MongoPlaceSearchReaderAdapter } from './mongo-place-search-reader.adapter';
import { type PlaceSearchQueryBuilder } from './query-builder/place-search.query-builder';
import { type SearchQuery } from '../../search.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('MongoPlaceSearchReaderAdapter', () => {
  const mockPlacesDatabaseService: Pick<
    PlacesDatabaseService,
    'aggregatePlaces'
  > = {
    aggregatePlaces: vi.fn(),
  };

  const mockQueryBuilder: Pick<PlaceSearchQueryBuilder, 'build'> = {
    build: vi.fn(),
  };

  const adapter = new MongoPlaceSearchReaderAdapter(
    mockPlacesDatabaseService as PlacesDatabaseService,
    mockQueryBuilder as PlaceSearchQueryBuilder,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('translates query to pipelines and aggregates both records and total count', async () => {
    const query: SearchQuery = { location: { country: 'FR' } };
    const resultsPipeline = [{ $match: { status: 'ONLINE' } }];
    const countPipeline = [
      { $match: { status: 'ONLINE' } },
      { $count: 'totalResults' },
    ];

    vi.mocked(mockQueryBuilder.build).mockReturnValue({
      resultsPipeline,
      countPipeline,
    });
    vi.mocked(mockPlacesDatabaseService.aggregatePlaces)
      .mockResolvedValueOnce([{ lieu_id: 1 }])
      .mockResolvedValueOnce([{ totalResults: 7 }]);

    const result = await adapter.search(query, { page: 2, limit: 10 });

    expect(mockQueryBuilder.build).toHaveBeenCalledWith(query, {
      page: 2,
      limit: 10,
    });
    expect(mockPlacesDatabaseService.aggregatePlaces).toHaveBeenNthCalledWith(
      1,
      resultsPipeline,
    );
    expect(mockPlacesDatabaseService.aggregatePlaces).toHaveBeenNthCalledWith(
      2,
      countPipeline,
    );
    expect(result).toEqual({
      records: [{ lieu_id: 1 }],
      totalResults: 7,
    });
  });

  it('defaults totalResults to zero when count result is empty', async () => {
    vi.mocked(mockQueryBuilder.build).mockReturnValue({
      resultsPipeline: [],
      countPipeline: [],
    });
    vi.mocked(mockPlacesDatabaseService.aggregatePlaces)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await adapter.search(
      { location: { country: 'FR' } },
      { page: 1, limit: 20 },
    );

    expect(result.totalResults).toBe(0);
  });
});
