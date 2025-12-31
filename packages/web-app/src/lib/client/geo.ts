/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
