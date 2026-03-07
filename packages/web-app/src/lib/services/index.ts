import { fetch } from '$lib/client';
import getLocationService from './locationService';
import getSearchService from './placesService';

export { zendeskService } from './zendeskService';
export const locationService = getLocationService(fetch);
export const searchService = getSearchService(fetch);
