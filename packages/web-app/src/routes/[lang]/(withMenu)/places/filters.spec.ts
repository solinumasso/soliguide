import { describe, expect, it } from 'vitest';
import AcUnit from 'svelte-google-materialdesign-icons/Ac_unit.svelte';
import { Categories, CountryCodes } from '@soliguide/common';

import {
  buildSearchResultApiFilters,
  getAllSearchResultFilterNames,
  getAvailableSearchResultFilters,
  readSelectedFilters,
  toFilterUrlParams
} from './filters';
import type { EmergencyDefinition } from '$lib/emergency';

const EMERGENCY_WITH_FILTER: EmergencyDefinition = {
  id: 'test-emergency',
  active: true,
  countries: [CountryCodes.FR],
  filter: {
    name: 'airConditioned',
    translationKey: 'ACCESS_CONDITION_AIR_CONDITIONED',
    icon: AcUnit,
    modalities: { thermalComfort: { airConditioned: true } }
  }
};

/** An emergency that only promotes categories: no filter, no tag. */
const HIGHLIGHT_ONLY_EMERGENCY: EmergencyDefinition = {
  id: 'highlight-only',
  active: true,
  countries: [CountryCodes.ES],
  highlight: {
    titleKey: 'TITLE',
    descriptionKey: 'DESCRIPTION',
    iconUrl: '/icon.png',
    quickSearches: [{ category: Categories.FOOD }]
  }
};

const getFilterNames = (emergency: EmergencyDefinition | null): string[] =>
  getAvailableSearchResultFilters(emergency).map(({ name }) => name);

describe('Available search result filters', () => {
  it('exposes only the permanent filters when no emergency is running', () => {
    expect(getFilterNames(null)).toEqual(['openToday', 'pmr', 'animal']);
  });

  it('inserts the emergency filter right after the opening filter', () => {
    expect(getFilterNames(EMERGENCY_WITH_FILTER)).toEqual([
      'openToday',
      'airConditioned',
      'pmr',
      'animal'
    ]);
  });

  it('leaves the list untouched for an emergency that declares no filter', () => {
    expect(getFilterNames(HIGHLIGHT_ONLY_EMERGENCY)).toEqual(['openToday', 'pmr', 'animal']);
  });

  it('gives every filter a label and an icon to render', () => {
    getAvailableSearchResultFilters(EMERGENCY_WITH_FILTER).forEach((filter) => {
      expect({ name: filter.name, labelled: filter.translationKey.length > 0 }).toEqual({
        name: filter.name,
        labelled: true
      });
      expect(filter.icon).toBeDefined();
    });
  });
});

describe('Search result API filters', () => {
  const FR_FILTERS = getAvailableSearchResultFilters(EMERGENCY_WITH_FILTER);
  const ES_FILTERS = getAvailableSearchResultFilters(null);

  it('builds API filters from selected UI filters', () => {
    expect(
      buildSearchResultApiFilters(['openToday', 'airConditioned', 'pmr', 'animal'], FR_FILTERS)
    ).toEqual({
      openToday: true,
      modalities: {
        pmr: true,
        animal: true,
        thermalComfort: { airConditioned: true }
      }
    });
  });

  it('leaves out the opening parameter when the toggle is off', () => {
    expect(buildSearchResultApiFilters(['pmr', 'animal'], FR_FILTERS)).toEqual({
      modalities: { pmr: true, animal: true }
    });
  });

  it('sends nothing at all when no filter is selected', () => {
    expect(buildSearchResultApiFilters([], FR_FILTERS)).toEqual({});
  });

  it('ignores a filter the country does not expose', () => {
    expect(buildSearchResultApiFilters(['airConditioned'], ES_FILTERS)).toEqual({});
  });

  it('ignores a filter name it does not know', () => {
    expect(buildSearchResultApiFilters(['whatever'], FR_FILTERS)).toEqual({});
  });

  it('merges a nested modality group instead of overwriting it', () => {
    const heatedEmergency: EmergencyDefinition = {
      ...EMERGENCY_WITH_FILTER,
      filter: {
        ...EMERGENCY_WITH_FILTER.filter!,
        name: 'heated',
        modalities: { thermalComfort: { heated: true } }
      }
    };
    const availableFilters = [
      ...getAvailableSearchResultFilters(EMERGENCY_WITH_FILTER),
      ...getAvailableSearchResultFilters(heatedEmergency)
    ];

    expect(buildSearchResultApiFilters(['airConditioned', 'heated'], availableFilters)).toEqual({
      modalities: { thermalComfort: { airConditioned: true, heated: true } }
    });
  });
});

describe('Search result filters and the URL', () => {
  const FR_FILTERS = getAvailableSearchResultFilters(EMERGENCY_WITH_FILTER);

  it('reads the selected filters in display order', () => {
    expect(readSelectedFilters({ animal: 'true', openToday: 'true' }, FR_FILTERS)).toEqual([
      'openToday',
      'animal'
    ]);
  });

  it('ignores a parameter that is not exactly "true"', () => {
    expect(readSelectedFilters({ openToday: 'yes', pmr: '' }, FR_FILTERS)).toEqual([]);
  });

  it('ignores a parameter for a filter the country does not expose', () => {
    expect(
      readSelectedFilters({ airConditioned: 'true' }, getAvailableSearchResultFilters(null))
    ).toEqual([]);
  });

  it('serializes the selected filters back into URL parameters', () => {
    expect(toFilterUrlParams(['openToday', 'airConditioned'])).toEqual({
      openToday: 'true',
      airConditioned: 'true'
    });
  });

  it('knows every filter name ever used, so a stale parameter can be stripped', () => {
    const allNames = getAllSearchResultFilterNames();

    expect(allNames).toContain('airConditioned');
    expect(new Set(allNames).size).toBe(allNames.length);
  });
});
