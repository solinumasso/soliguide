import type { RequestOptionsFrontend } from '$lib/services/types';
import type { SearchModalities } from '@soliguide/common';

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
  options: SearchOptions;
  openToday?: boolean;
  modalities?: SearchModalities;
}

// Need to forward info from frontend request
export interface RequestOptions extends RequestOptionsFrontend {
  origin: string;
  referer: string;
}
