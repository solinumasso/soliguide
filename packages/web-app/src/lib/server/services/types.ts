import type { RequestOptionsFrontend } from '$lib/services/types';

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
}

// Need to forward info from frontend request
export interface RequestOptions extends RequestOptionsFrontend {
  origin: string;
  referer: string;
}
