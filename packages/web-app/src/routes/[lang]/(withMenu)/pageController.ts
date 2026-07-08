import { posthogService } from '$lib/services/posthogService';
import type {
  LocationService,
  PosthogCaptureFunction,
  SearchParamsService
} from '$lib/services/types';
import type { SoliguideCountries, SupportedLanguagesCode } from '@soliguide/common';
import type { CategorySearch } from '$lib/constants';
import { getErrorValue } from '$lib/ts';
import type { HomePageController, QuickSearchFilters, QuickSearchOutcome } from './types';

/**
 * Returns an instance of the home page controller
 */
export const getHomePageController = (
  locationService: LocationService,
  searchParamsService: SearchParamsService
): HomePageController => {
  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`homepage-${eventName}`, properties);
  };

  const buildQuickSearch = async (
    category: CategorySearch,
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    getGeolocation: () => Promise<GeolocationPosition>,
    filters: QuickSearchFilters = {}
  ): Promise<QuickSearchOutcome> => {
    try {
      // Triggers the native prompt when the permission has not been decided yet.
      const {
        coords: { latitude, longitude }
      } = await getGeolocation();

      const location = await locationService.getLocationFromPosition(country, latitude, longitude);
      if (!location) {
        return { status: 'failed' };
      }

      const params = searchParamsService.buildPlacesSearchParams(location, category, lang);

      return {
        status: 'ready',
        params: filters.airConditioned ? { ...params, airConditioned: 'true' } : params
      };
    } catch (error: unknown) {
      const errorValue = getErrorValue(error);
      const message = typeof errorValue === 'string' ? errorValue : errorValue?.message;

      // Geolocation not authorized (denied, or the native prompt was declined) -> show the modal.
      if (message === 'UNAUTHORIZED_LOCATION') {
        return { status: 'permissionRequired' };
      }

      return { status: 'failed' };
    }
  };

  return {
    captureEvent,
    buildQuickSearch
  };
};
