import { captureException } from '@sentry/sveltekit';

export const isGeolocSupported = (): boolean =>
  typeof navigator !== 'undefined' && 'geolocation' in navigator;

export const getGeolocationPermissionState = async (): Promise<
  PermissionState | 'unsupported' | 'unknown'
> => {
  if (!isGeolocSupported()) {
    return 'unsupported';
  }

  if (!navigator.permissions) {
    return 'unknown';
  }

  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    return permissionStatus.state;
  } catch {
    return 'unknown';
  }
};

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

export const getMapLink = (
  address: string,
  coordinates?: [number, number] // [longitude, latitude] in GeoJSON format
): string => {
  if (coordinates?.length === 2) {
    const [lng, lat] = coordinates;
    return `https://www.google.com/maps/dir//${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};
