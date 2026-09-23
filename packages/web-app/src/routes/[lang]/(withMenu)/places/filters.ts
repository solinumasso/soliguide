import AccessTime from 'svelte-google-materialdesign-icons/Access_time.svelte';
import AccessibleForward from 'svelte-google-materialdesign-icons/Accessible_forward.svelte';
import Pets from 'svelte-google-materialdesign-icons/Pets.svelte';
import type { ComponentType } from 'svelte';
import type { SearchModalities } from '@soliguide/common';

import { EMERGENCIES, type EmergencyDefinition } from '$lib/emergency';

/**
 * A toggle of the results page. Each definition carries its own contribution to
 * the search request, so no consumer ever has to switch on a filter name.
 */
export interface SearchResultFilterDefinition {
  /** URL query parameter, toggle identifier and analytics label. */
  name: string;
  translationKey: string;
  icon: ComponentType;
  /** `openToday` is a top-level search parameter, every other filter is a modality. */
  appliesOpenToday?: boolean;
  modalities?: SearchModalities;
}

/**
 * A filter name. Open-ended on purpose: an emergency contributes a filter of its
 * own, so the set is only known once the country's emergency is resolved.
 */
export type SearchResultFilter = string;

const OPEN_TODAY_FILTER: SearchResultFilterDefinition = {
  name: 'openToday',
  translationKey: 'SEARCH_FILTER_OPEN_TODAY',
  icon: AccessTime,
  appliesOpenToday: true
};

/** The modality filters every country exposes, in display order. */
const PERMANENT_MODALITY_FILTERS: SearchResultFilterDefinition[] = [
  {
    name: 'pmr',
    translationKey: 'ACCESS_CONDITION_PMR',
    icon: AccessibleForward,
    modalities: { pmr: true }
  },
  {
    name: 'animal',
    translationKey: 'ACCESS_CONDITION_ACCEPTED_ANIMALS',
    icon: Pets,
    modalities: { animal: true }
  }
];

/**
 * The filters the results page exposes. The emergency filter comes first among
 * the modality ones: it is the reason the emergency is running, so it is the
 * most visible — and it simply disappears when no emergency is active.
 */
export const getAvailableSearchResultFilters = (
  emergency: EmergencyDefinition | null
): readonly SearchResultFilterDefinition[] => [
  OPEN_TODAY_FILTER,
  ...(emergency?.filter ? [emergency.filter] : []),
  ...PERMANENT_MODALITY_FILTERS
];

/**
 * Every filter name the application may ever have written in a URL, retired
 * emergencies included, so that a stale parameter is stripped rather than left
 * to linger in the query string of a country that no longer exposes it.
 */
export const getAllSearchResultFilterNames = (): readonly string[] => [
  OPEN_TODAY_FILTER.name,
  ...PERMANENT_MODALITY_FILTERS.map(({ name }) => name),
  ...EMERGENCIES.flatMap(({ filter }) => (filter ? [filter.name] : []))
];

export interface SearchResultApiFilters {
  openToday?: boolean;
  modalities?: SearchModalities;
}

/**
 * Merges two modality filters. `thermalComfort` is the only nested group of
 * `SearchModalities`, so a flat spread would drop a sibling key.
 */
const mergeSearchModalities = (
  base: SearchModalities,
  addition: SearchModalities
): SearchModalities => ({
  ...base,
  ...addition,
  ...((base.thermalComfort ?? addition.thermalComfort)
    ? { thermalComfort: { ...base.thermalComfort, ...addition.thermalComfort } }
    : {})
});

/**
 * Translate the selected toggles into API parameters. A name that is not among
 * the available definitions contributes nothing, which is what makes a stale URL
 * harmless without any explicit guard.
 */
export const buildSearchResultApiFilters = (
  selectedFilters: readonly SearchResultFilter[],
  availableFilters: readonly SearchResultFilterDefinition[]
): SearchResultApiFilters => {
  const selectedDefinitions = availableFilters.filter(({ name }) => selectedFilters.includes(name));

  const modalities = selectedDefinitions.reduce<SearchModalities>(
    (merged, definition) => mergeSearchModalities(merged, definition.modalities ?? {}),
    {}
  );

  return {
    ...(selectedDefinitions.some(({ appliesOpenToday }) => appliesOpenToday)
      ? { openToday: true }
      : {}),
    ...(Object.keys(modalities).length > 0 ? { modalities } : {})
  };
};

/** The filter names carried by a set of URL parameters, in display order. */
export const readSelectedFilters = (
  urlParams: Record<string, string | undefined>,
  availableFilters: readonly SearchResultFilterDefinition[]
): SearchResultFilter[] =>
  availableFilters.filter(({ name }) => urlParams[name] === 'true').map(({ name }) => name);

/** The URL parameters standing for a set of selected filters. */
export const toFilterUrlParams = (
  selectedFilters: readonly SearchResultFilter[]
): Record<string, string> => Object.fromEntries(selectedFilters.map((filter) => [filter, 'true']));
