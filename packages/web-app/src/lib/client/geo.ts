import { captureException } from '@sentry/sveltekit';

export const isGeolocSupported = (): boolean => 'geolocation' in navigator;

export const getGeolocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (isGeolocSupported() && navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error: GeolocationPositionError) => {
          const getErrorType = (code: number): string => {
            if (code === 1) {
              return 'PERMISSION_DENIED';
            } else if (code === 2) {
              return 'POSITION_UNAVAILABLE';
            }
            return 'TIMEOUT';
          };

          captureException(new Error(`Geolocation error: ${getErrorType(error.code)}`), {
            extra: {
              code: error.code,
              message: error.message
            }
          });

          if (error.code === 1) {
            reject(new Error('UNAUTHORIZED_LOCATION'));
          } else if (error.code === 3) {
            reject(new Error('GEOLOCATION_TIMEOUT'));
          } else {
            reject(new Error('UNABLE_TO_LOCATE_YOU'));
          }
        },
        {
          timeout: 10000,
          maximumAge: 60000,
          enableHighAccuracy: true
        }
      );
    } else {
      reject(new Error('UNABLE_TO_LOCATE_YOU'));
    }
  });

export const getMapLink = (address: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};
