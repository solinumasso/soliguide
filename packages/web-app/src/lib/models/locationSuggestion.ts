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
import { z } from 'zod';
import { GeoTypes, LocationAutoCompleteAddress } from '@soliguide/common';

export const LocationSuggestionSchema = z.object({
  suggestionLine1: z.string(),
  suggestionLine2: z.string(),
  geoValue: z.string(),
  geoType: z.nativeEnum(GeoTypes),
  suggestionLabel: z.string(),
  coordinates: z.array(z.number()),
  department: z.string().optional(),
  region: z.string().optional(),
  departmentCode: z.string().optional(),
  regionCode: z.string().optional(),
  country: z.string().optional()
});

export type LocationSuggestion = z.infer<typeof LocationSuggestionSchema>;

/*
  Transformation Rules:
    geoType = 'position'    --> suggestionLine1 = {name}, suggestionLine2 = {postalCode city}
    geoType = 'citiesGroup' --> suggestionLine1 = {name}, suggestionLine2 = {postalCode city}
    geoType = 'city'        --> suggestionLine1 = {name (postalCode)}, suggestionLine2 = GEOTYPE_VILLE
    geoType = 'department'  --> suggestionLine1 = {name}, suggestionLine2 = GEOTYPE_DEPARTEMENT
    geoType = 'region'      --> suggestionLine1 = {name}, suggestionLine2 = GEOTYPE_REGION
    geoType = 'country'     --> suggestionLine1 = {name}
    geoType = 'inconnu'     --> suggestionLine1 = {label}
 */

/**
 * Get the first line of the location-api result
 */
export const getLine1 = (data: LocationAutoCompleteAddress): string => {
  if (data.geoType === GeoTypes.UNKNOWN) {
    return data.label;
  }

  if (data.geoType === GeoTypes.CITY) {
    return `${data.name} (${data.postalCode})`;
  }

  return data.name ?? '';
};

/**
 * Get the second line of the location-api result
 */
export const getLine2 = (data: LocationAutoCompleteAddress): string => {
  if (data.geoType === GeoTypes.POSITION || data.geoType === GeoTypes.CITIES_GROUP) {
    return `${data.postalCode} ${data.city}`;
  }

  if (data.geoType === GeoTypes.CITY) {
    return 'GEOTYPE_VILLE';
  }

  if (data.geoType === GeoTypes.DEPARTMENT) {
    return 'GEOTYPE_DEPARTEMENT';
  }

  if (data.geoType === GeoTypes.REGION) {
    return 'GEOTYPE_REGION';
  }

  return '';
};

/**
 * Get the label of the location-api result
 */
export const getLabel = (geoType: GeoTypes, line1: string, line2: string): string => {
  if (geoType === GeoTypes.CITY || geoType === GeoTypes.DEPARTMENT || geoType === GeoTypes.REGION) {
    return line1 ?? '';
  }

  return [line1, line2].filter((line) => line).join(', ');
};

/**
 * Converts a location-api result into the minimal needed in the webapp
 */
const buildSuggestion = (data: LocationAutoCompleteAddress): LocationSuggestion | null => {
  const line1 = getLine1(data);
  const line2 = getLine2(data);
  const label = getLabel(data.geoType, line1, line2);

  const preprocessed: LocationSuggestion = {
    suggestionLine1: line1,
    suggestionLine2: line2,
    suggestionLabel: label,
    geoValue: data.geoValue,
    geoType: data.geoType,
    coordinates: data.coordinates,
    department: data?.department ?? '',
    region: data?.region ?? '',
    departmentCode: data?.departmentCode ?? '',
    regionCode: data?.regionCode ?? '',
    country: data?.country ?? ''
  };

  const result = LocationSuggestionSchema.safeParse(preprocessed);

  if (!result.success) {
    return null;
  }

  return result.data;
};

/**
 * Remove invalid parsed items
 */
const mapSuggestions = (suggestions: LocationAutoCompleteAddress[]): LocationSuggestion[] =>
  suggestions.map(buildSuggestion).filter((item) => item !== null);

/**
 * Determines the default distance to use in a search given a geotype
 */
const getDistanceFromGeoType = (geotype: GeoTypes): number => {
  switch (geotype) {
    case GeoTypes.CITY:
      return 20;
    case GeoTypes.DEPARTMENT:
      return 50;
    case GeoTypes.REGION:
      return 100;
    default:
      return 10;
  }
};

export { buildSuggestion, mapSuggestions, getDistanceFromGeoType };
