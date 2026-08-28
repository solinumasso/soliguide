import { fetch } from '$lib/client';
import getLocationService from './locationService';
import getSearchService from './placesService';

export {
  canNativeAppOpenSettings,
  canNativeAppSwitchCountry,
  captureNativeAppVersion,
  isInsideNativeApp,
  requestNativeCountrySwitch,
  requestNativeOpenSettings
} from './nativeBridgeService';
export { zendeskService } from './zendeskService';
export { searchParamsService } from './searchParamsService';
export const locationService = getLocationService(fetch);
export const searchService = getSearchService(fetch);
