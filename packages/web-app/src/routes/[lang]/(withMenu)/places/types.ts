import type { Writable } from 'svelte/store';
import type { SearchResult } from '$lib/models/types';
import type { PosthogCaptureFunction, SearchParams } from '$lib/services/types';
import type { SearchResultFilter, SearchResultFilterDefinition } from './filters';

/**
 * Similar to SearchPageParams (search page), but all url params are strings.
 *
 * The seven location and category parameters are always present; each selected
 * filter adds one "true" entry named after the filter, hence the index
 * signature — the set of filters depends on the country's emergency.
 */
export interface PageParams {
  lang: string;
  location: string;
  latitude: string;
  longitude: string;
  type: string;
  label: string;
  category: string;
  [filterName: string]: string;
}

export interface PageState {
  isLoading: boolean;
  initializing: boolean;
  adressLabel: string;
  search: SearchParams;
  searchResult: SearchResult;
  searchError: string | null;
  hasMorePages: boolean;
  urlParams: PageParams | null;
  selectedFilters: SearchResultFilter[];
  /**
   * The filters this country exposes, captured at init so that updating them
   * later needs neither the theme nor the Svelte context.
   */
  availableFilters: readonly SearchResultFilterDefinition[];
}

/** Exposes the state in readonly and functions to act on it */
export interface GetSearchResultPageController {
  subscribe: Writable<PageState>['subscribe'];
  init(
    urlParams: PageParams,
    availableFilters: readonly SearchResultFilterDefinition[]
  ): Promise<void>;
  getNextResults(): Promise<void>;
  updateSearchFilters(selectedFilters: SearchResultFilter[]): Promise<void>;
  captureEvent: PosthogCaptureFunction;
}
