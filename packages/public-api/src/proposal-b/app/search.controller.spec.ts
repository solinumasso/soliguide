/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchModule } from './search.module';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    controller = moduleRef.get(SearchController);
  });

  it('returns canonical response when version header is missing', async () => {
    const response = (await controller.search({}, undefined)) as {
      results: Array<Record<string, unknown>>;
    };

    expect(response.results[0]).toHaveProperty('seoUrl');
    expect(response.results[0]).not.toHaveProperty('slug');
    expect(response.results[0].name).toEqual(
      expect.objectContaining({
        originalName: expect.any(String),
        translatedName: expect.any(String),
      }),
    );
  });

  it('returns downgraded response when old version is requested', async () => {
    const response = (await controller.search({}, '2026-03-03')) as {
      results: Array<Record<string, unknown>>;
    };

    expect(response.results[0]).toHaveProperty('slug');
    expect(response.results[0]).not.toHaveProperty('seoUrl');
    expect(typeof response.results[0].name).toBe('string');
  });

  it('supports old and canonical request query shapes', async () => {
    await expect(
      controller.search({ openToday: 'true' }, '2026-03-03'),
    ).resolves.toBeDefined();

    await expect(
      controller.search({ isOpenToday: 'true' }, '2026-03-09'),
    ).resolves.toBeDefined();
  });
});
