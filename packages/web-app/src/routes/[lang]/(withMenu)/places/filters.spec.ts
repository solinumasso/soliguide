import { describe, expect, it } from 'vitest';
import { buildSearchResultApiFilters } from './filters';

describe('Search result filters', () => {
  it('builds API filters from selected UI filters', () => {
    expect(buildSearchResultApiFilters(['openToday', 'airConditioned', 'pmr', 'animal'])).toEqual({
      openToday: true,
      modalities: {
        pmr: true,
        animal: true,
        thermalComfort: { airConditioned: true }
      }
    });
  });
});
