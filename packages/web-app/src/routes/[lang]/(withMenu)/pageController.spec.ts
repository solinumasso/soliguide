import { beforeEach, describe, it, expect, vitest, vi } from 'vitest';
import { getHomePageController } from './pageController';
import { posthogService } from '$lib/services/posthogService';
import { searchParamsService } from '$lib/services/searchParamsService';
import type { HomePageController } from './types';
import type { LocationService } from '$lib/services/types';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import { Categories, CountryCodes, GeoTypes, SupportedLanguagesCode } from '@soliguide/common';

const positionSuggestion: LocationSuggestion = {
  suggestionLine1: 'Lyon',
  suggestionLine2: '69001 Lyon',
  geoValue: '69123',
  geoType: GeoTypes.CITY,
  suggestionLabel: 'Lyon',
  coordinates: [45.764, 4.8357]
};

const geolocPosition = (latitude: number, longitude: number): Promise<GeolocationPosition> =>
  Promise.resolve({
    timestamp: 1725217275466,
    coords: {
      accuracy: 35,
      latitude,
      longitude,
      altitude: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ''
    },
    toJSON: () => ''
  });

const geolocUnauthorized = () => Promise.reject(new Error('UNAUTHORIZED_LOCATION'));
const geolocTimeout = () => Promise.reject(new Error('GEOLOCATION_TIMEOUT'));

const createMockLocationService = (): {
  service: LocationService;
  setResult: (result: LocationSuggestion | null) => void;
  getLocationFromPositionSpy: ReturnType<typeof vi.fn>;
} => {
  let result: LocationSuggestion | null = positionSuggestion;

  const getLocationFromPositionSpy = vi.fn(
    (): Promise<LocationSuggestion | null> => Promise.resolve(result)
  );

  const service: LocationService = {
    getLocationSuggestions: () => Promise.resolve([]),
    getLocationFromPosition: getLocationFromPositionSpy
  };

  return {
    service,
    setResult: (value) => {
      result = value;
    },
    getLocationFromPositionSpy
  };
};

describe('Home page controller', () => {
  // skipcq: JS-0119
  let pageState: HomePageController;
  // skipcq: JS-0119
  let locationMock: ReturnType<typeof createMockLocationService>;

  beforeEach(() => {
    locationMock = createMockLocationService();
    pageState = getHomePageController(locationMock.service, searchParamsService);
  });

  describe('Posthog capture events', () => {
    it('should call the posthogService with good prefix when capturing event', () => {
      vitest.spyOn(posthogService, 'capture');

      pageState.captureEvent('test', {});

      expect(posthogService.capture).toHaveBeenCalledWith('homepage-test', {});
    });
  });

  describe('buildQuickSearch', () => {
    it('returns a ready outcome with the params from the user position', async () => {
      locationMock.setResult(positionSuggestion);

      const outcome = await pageState.buildQuickSearch(
        Categories.FOOD,
        CountryCodes.FR,
        SupportedLanguagesCode.FR,
        () => geolocPosition(45.764, 4.8357)
      );

      expect(locationMock.getLocationFromPositionSpy).toHaveBeenCalledWith(
        CountryCodes.FR,
        45.764,
        4.8357
      );
      expect(outcome).toEqual({
        status: 'ready',
        params: {
          lang: SupportedLanguagesCode.FR,
          location: '69123',
          latitude: '45.764',
          longitude: '4.8357',
          type: GeoTypes.CITY,
          label: 'Lyon',
          category: Categories.FOOD
        }
      });
    });

    it('adds the air-conditioned filter to the params when requested', async () => {
      locationMock.setResult(positionSuggestion);

      const outcome = await pageState.buildQuickSearch(
        Categories.LIBRARIES,
        CountryCodes.FR,
        SupportedLanguagesCode.FR,
        () => geolocPosition(45.764, 4.8357),
        { airConditioned: true }
      );

      expect(outcome.status).toEqual('ready');
      if (outcome.status === 'ready') {
        expect(outcome.params.category).toEqual(Categories.LIBRARIES);
        expect(outcome.params.airConditioned).toEqual('true');
      }
    });

    it('returns permissionRequired when geolocation is not authorized', async () => {
      const outcome = await pageState.buildQuickSearch(
        Categories.FOOD,
        CountryCodes.FR,
        SupportedLanguagesCode.FR,
        geolocUnauthorized
      );

      expect(outcome).toEqual({ status: 'permissionRequired' });
      // Without a position, the reverse-geocoding must not be attempted
      expect(locationMock.getLocationFromPositionSpy).not.toHaveBeenCalled();
    });

    it('returns failed when the position cannot be reverse-geocoded', async () => {
      locationMock.setResult(null);

      const outcome = await pageState.buildQuickSearch(
        Categories.FOOD,
        CountryCodes.FR,
        SupportedLanguagesCode.FR,
        () => geolocPosition(45.764, 4.8357)
      );

      expect(outcome).toEqual({ status: 'failed' });
    });

    it('returns failed on a non-permission geolocation error', async () => {
      const outcome = await pageState.buildQuickSearch(
        Categories.FOOD,
        CountryCodes.FR,
        SupportedLanguagesCode.FR,
        geolocTimeout
      );

      expect(outcome).toEqual({ status: 'failed' });
    });
  });
});
