import type { SoliguideCountries, SupportedLanguagesCode } from '@soliguide/common';
import type { PlacesSearchParams, PosthogCaptureFunction } from '$lib/services/types';
import type { CategorySearch } from '$lib/constants';

/**
 * Names of the search result filters a 1-click search pre-applies. The home page
 * never knows what they mean: they are carried to the results page as URL
 * parameters and resolved there against the filters the country exposes.
 */
export type QuickSearchFilters = readonly string[];

/**
 * Result of a 1-click search attempt:
 * - `ready`: a location was resolved, the search can be launched with `params`
 * - `permissionRequired`: geolocation is not authorized, the recovery modal must be shown
 * - `failed`: an unexpected error occurred (e.g. reverse-geocoding failed)
 */
export type QuickSearchOutcome =
  | { status: 'ready'; params: PlacesSearchParams }
  | { status: 'permissionRequired' }
  | { status: 'failed' };

export interface HomePageController {
  captureEvent: PosthogCaptureFunction;
  /**
   * Attempt a 1-click search from the home page: get the user's position (native prompt when
   * needed), reverse-geocode it and build the search params. Returns a QuickSearchOutcome telling
   * the caller whether to navigate, show the authorization modal, or show an error.
   */
  buildQuickSearch(
    category: CategorySearch,
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    getGeolocation: () => Promise<GeolocationPosition>,
    filters?: QuickSearchFilters
  ): Promise<QuickSearchOutcome>;
}
