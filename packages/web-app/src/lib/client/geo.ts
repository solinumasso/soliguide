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
export const isGeolocSupported = (): boolean => 'geolocation' in navigator;

export const getGeolocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (isGeolocSupported() && navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error: GeolocationPositionError) => {
          if (error.PERMISSION_DENIED) {
            reject(new Error('UNAUTHORIZED_LOCATION'));
          } else {
            reject(new Error('UNABLE_TO_LOCATE_YOU'));
          }
        },
        {
          timeout: 5000,
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
