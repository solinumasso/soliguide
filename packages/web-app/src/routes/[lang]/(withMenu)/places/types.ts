import type { Writable } from 'svelte/store';
import type { SearchResult } from '$lib/models/types';
import type { PosthogCaptureFunction, SearchParams } from '$lib/services/types';
import type { SearchResultFilter } from './filters';

// Similar to SearchPageParams (search page), but all url params are strings
export interface PageParams {
  lang: string;
  location: string;
  latitude: string;
  longitude: string;
  type: string;
  label: string;
  category: string;
  openToday?: string;
  pmr?: string;
  animal?: string;
  airConditioned?: string;
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
}

/** Exposes the state in readonly and functions to act on it */
export interface GetSearchResultPageController {
  subscribe: Writable<PageState>['subscribe'];
  init(urlParams: PageParams): Promise<void>;
  getNextResults(): Promise<void>;
  updateSearchFilters(selectedFilters: SearchResultFilter[]): Promise<void>;
  captureEvent: PosthogCaptureFunction;
}
