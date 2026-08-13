import type { RequestOptionsFrontend } from '$lib/services/types';
import type { SearchModalities, SoliguideCountries } from '@soliguide/common';

export interface SearchOptions {
  page: number;
}

export interface SearchParams {
  lang: string;
  location: string;
  category: string | null;
  coordinates: number[];
  type: string;
  distance: number;
  /**
   * Country the search is restricted to. Comes from the resolved theme, never
   * from the client: without it the API falls back to France and a Spanish or
   * Andorran search silently returns French places.
   */
  country: SoliguideCountries;
  options: SearchOptions;
  openToday?: boolean;
  modalities?: SearchModalities;
}

// Need to forward info from frontend request
export interface RequestOptions extends RequestOptionsFrontend {
  origin: string;
  referer: string;
}
