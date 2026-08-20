import { describe, expect, it } from 'vitest';
import { Themes } from '@soliguide/common';

import { buildSearchResultApiFilters, getAvailableSearchResultFilters } from './filters';
import { buildThemeDefinition, THEME_BLUEPRINTS } from '$lib/theme';

const getFilterNames = (theme: Themes): string[] =>
  getAvailableSearchResultFilters(
    buildThemeDefinition(THEME_BLUEPRINTS[theme], {}).capabilities
  ).map(({ name }) => name);

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

describe('Available search result filters', () => {
  it('exposes the air conditioning filter in France', () => {
    expect(getFilterNames(Themes.SOLIGUIDE_FR)).toEqual([
      'openToday',
      'airConditioned',
      'pmr',
      'animal'
    ]);
  });

  it.each([Themes.SOLIGUIA_ES, Themes.SOLIGUIA_AD])(
    'hides the air conditioning filter for %s',
    (theme) => {
      expect(getFilterNames(theme)).toEqual(['openToday', 'pmr', 'animal']);
    }
  );
});
