import type { SearchModalities } from '@soliguide/common';

export const SEARCH_RESULT_FILTERS = [
  {
    name: 'openToday',
    translationKey: 'SEARCH_RESULT_FILTER_OPEN'
  },
  {
    name: 'airConditioned',
    translationKey: 'ACCESS_CONDITION_AIR_CONDITIONED'
  },
  {
    name: 'pmr',
    translationKey: 'SEARCH_RESULT_FILTER_PMR'
  },
  {
    name: 'animal',
    translationKey: 'SEARCH_RESULT_FILTER_ANIMALS'
  }
] as const satisfies readonly {
  name: string;
  translationKey: string;
}[];

export type SearchResultFilter = (typeof SEARCH_RESULT_FILTERS)[number]['name'];

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
