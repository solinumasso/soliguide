import { z } from 'zod';
import { GeoTypes, LocationAutoCompleteAddress } from '@soliguide/common';

import { getStreetFromAddress } from './address';

export const LocationSuggestionSchema = z.object({
  // A suggestion without text would render as a blank row in the list
  suggestionLine1: z.string().min(1),
  suggestionLine2: z.string(),
  geoValue: z.string(),
  geoType: z.nativeEnum(GeoTypes),
  suggestionLabel: z.string().min(1),
  coordinates: z.array(z.number())
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

  `name` is optional in the location-api payload, `label` is not: wherever {name}
  appears above, {label} is used as a fallback.
 */

/**
 * Get the first line of the location-api result
 *
 * `label` is the only text field the location-api always fills in. A country
 * result, the one that lets a visitor search a whole country, carries no `name`
 * at all, so falling back to `label` is what keeps it from rendering blank.
 */
export const getLine1 = (data: LocationAutoCompleteAddress): string => {
  const displayName = data.name || data.label;

  if (data.geoType === GeoTypes.UNKNOWN) {
    return data.label;
  }

  if (data.geoType === GeoTypes.CITY) {
    return data.postalCode ? `${displayName} (${data.postalCode})` : displayName;
  }

  // Spain and Andorra return the whole address here, France the street alone
  if (data.geoType === GeoTypes.POSITION || data.geoType === GeoTypes.CITIES_GROUP) {
    return getStreetFromAddress(displayName, data.postalCode);
  }

  return displayName;
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
    coordinates: data.coordinates
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
