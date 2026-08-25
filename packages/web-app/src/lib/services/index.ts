import { fetch } from '$lib/client';
import getLocationService from './locationService';
import getSearchService from './placesService';

export { canNativeShellSwitchCountry, requestNativeCountrySwitch } from './nativeShellService';
export { zendeskService } from './zendeskService';
export { searchParamsService } from './searchParamsService';
export const locationService = getLocationService(fetch);
export const searchService = getSearchService(fetch);
