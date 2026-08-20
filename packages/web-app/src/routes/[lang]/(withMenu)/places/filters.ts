import type { SearchModalities } from '@soliguide/common';

import type { ThemeCapabilities } from '$lib/theme';

export const SEARCH_RESULT_FILTERS = [
  {
    name: 'openToday',
    translationKey: 'SEARCH_FILTER_OPEN_TODAY'
  },
  {
    name: 'airConditioned',
    translationKey: 'ACCESS_CONDITION_AIR_CONDITIONED',
    requiredCapability: 'thermalComfort'
  },
  {
    name: 'pmr',
    translationKey: 'ACCESS_CONDITION_PMR'
  },
  {
    name: 'animal',
    translationKey: 'ACCESS_CONDITION_ACCEPTED_ANIMALS'
  }
] as const satisfies readonly {
  name: string;
  translationKey: string;
  requiredCapability?: keyof ThemeCapabilities;
}[];

export type SearchResultFilterDefinition = (typeof SEARCH_RESULT_FILTERS)[number];

export type SearchResultFilter = SearchResultFilterDefinition['name'];

/**
 * The filters a theme exposes. A filter guarded by a capability disappears in
 * the countries that do not have it, so opening a country never has to touch
 * the results page.
 */
export const getAvailableSearchResultFilters = (
  capabilities: ThemeCapabilities
): readonly SearchResultFilterDefinition[] =>
  SEARCH_RESULT_FILTERS.filter((filter) => {
    const requiredCapability = 'requiredCapability' in filter ? filter.requiredCapability : null;

    return requiredCapability === null || capabilities[requiredCapability];
  });

export interface SearchResultApiFilters {
  openToday?: boolean;
  modalities?: SearchModalities;
}

export const buildSearchResultApiFilters = (
  selectedFilters: SearchResultFilter[]
): SearchResultApiFilters => {
  const modalities = selectedFilters.reduce<SearchModalities>((modalitiesValue, filter) => {
    if (filter === 'pmr' || filter === 'animal') {
      return { ...modalitiesValue, [filter]: true };
    }

    if (filter === 'airConditioned') {
      return { ...modalitiesValue, thermalComfort: { airConditioned: true } };
    }

    return modalitiesValue;
  }, {});

  return {
    ...(selectedFilters.includes('openToday') ? { openToday: true } : {}),
    ...(Object.keys(modalities).length > 0 ? { modalities } : {})
  };
};
