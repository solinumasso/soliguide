import { GeoTypes, type LocationAutoCompleteAddress } from '@soliguide/common';
import { describe, expect, it } from 'vitest';
import {
  buildSuggestion,
  getLabel,
  getLine1,
  getLine2,
  mapSuggestions
} from './locationSuggestion';

const data: LocationAutoCompleteAddress = {
  city: 'city',
  coordinates: [],
  department: 'department',
  geoType: GeoTypes.UNKNOWN,
  geoValue: 'geoValue',
  label: 'label',
  name: 'name',
  postalCode: 'postalCode',
  region: 'region',
  slugs: {}
};

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

describe('Location search results', () => {
  describe('First line of the suggestion', () => {
    it("With a geotype equals to position, the first line should like 'name'", () => {
      data.geoType = GeoTypes.POSITION;

      const result = getLine1(data);
      expect(result).toBe(data.name);
    });

    it("With a geotype equals to citiesGroup, the first line should like 'name'", () => {
      data.geoType = GeoTypes.CITIES_GROUP;

      const result = getLine1(data);
      expect(result).toBe(data.name);
    });

    it("With a geotype equals to city, the first line should like 'name (codePostal)'", () => {
      data.geoType = GeoTypes.CITY;

      const result = getLine1(data);
      expect(result).toBe(`${data.name} (${data.postalCode})`);
    });

    it("With a geotype equals to department, the first line should like 'name'", () => {
      data.geoType = GeoTypes.DEPARTMENT;

      const result = getLine1(data);
      expect(result).toBe(data.name);
    });

    it("With a geotype equals to region, the first line should like 'name'", () => {
      data.geoType = GeoTypes.REGION;

      const result = getLine1(data);
      expect(result).toBe(data.name);
    });

    it("With a geotype equals to country, the first line should like 'name'", () => {
      data.geoType = GeoTypes.COUNTRY;

      const result = getLine1(data);
      expect(result).toBe(data.name);
    });

    it("With a geotype equals to unknown, the first line should like 'label'", () => {
      data.geoType = GeoTypes.UNKNOWN;

      const result = getLine1(data);
      expect(result).toBe(data.label);
    });
  });

  describe('Second line of the suggestion', () => {
    it("With a geotype equals to position, the second line should like 'postalCode city'", () => {
      data.geoType = GeoTypes.POSITION;

      const result = getLine2(data);
      expect(result).toBe(`${data.postalCode} ${data.city}`);
    });

    it("With a geotype equals to postalCode, the second line should like 'postalCode city'", () => {
      data.geoType = GeoTypes.CITIES_GROUP;

      const result = getLine2(data);
      expect(result).toBe(`${data.postalCode} ${data.city}`);
    });

    it("With a geotype equals to city, the second line should like 'city'", () => {
      data.geoType = GeoTypes.CITY;

      const result = getLine2(data);
      expect(result).toBe('GEOTYPE_VILLE');
    });

    it("With a geotype equals to department, the second line should like 'department'", () => {
      data.geoType = GeoTypes.DEPARTMENT;

      const result = getLine2(data);
      expect(result).toBe('GEOTYPE_DEPARTEMENT');
    });

    it("With a geotype equals to region, the second line should like 'region'", () => {
      data.geoType = GeoTypes.REGION;

      const result = getLine2(data);
      expect(result).toBe('GEOTYPE_REGION');
    });

    it('With a geotype equals to country, the second line should be an empty string', () => {
      data.geoType = GeoTypes.COUNTRY;

      const result = getLine2(data);
      expect(result).toBe('');
    });

    it('With a geotype equals to unknown, the second line should be an empty string', () => {
      data.geoType = GeoTypes.UNKNOWN;

      const result = getLine2(data);
      expect(result).toBe('');
    });
  });

  describe('Label of the suggestion', () => {
    it("With a geotype equals to position, the label should like 'postalCode city'", () => {
      data.geoType = GeoTypes.POSITION;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(`${line1}, ${line2}`);
    });

    it("With a geotype equals to postalCode, the label should like 'postalCode city'", () => {
      data.geoType = GeoTypes.CITIES_GROUP;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(`${line1}, ${line2}`);
    });

    it("With a geotype equals to city, the label should like 'city'", () => {
      data.geoType = GeoTypes.CITY;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(line1);
    });

    it("With a geotype equals to department, the label should like 'department'", () => {
      data.geoType = GeoTypes.DEPARTMENT;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(line1);
    });

    it("With a geotype equals to region, the label should like 'region'", () => {
      data.geoType = GeoTypes.REGION;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(line1);
    });

    it('With a geotype equals to country, the label should be an empty string', () => {
      data.geoType = GeoTypes.COUNTRY;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(line1);
    });

    it('With a geotype equals to unknown, the label should be an empty string', () => {
      data.geoType = GeoTypes.UNKNOWN;
      const line1 = getLine1(data);
      const line2 = getLine2(data);

      const result = getLabel(data.geoType, line1, line2);
      expect(result).toBe(line1);
    });
  });
});

/**
 * Payloads copied verbatim from the location-api. A country result carries no
 * `name`, which used to produce a suggestion with no text at all.
 */
describe('Results without a name, as returned by the location-api', () => {
  const andorraCountry: LocationAutoCompleteAddress = {
    label: 'Andorra',
    coordinates: [1.5255804423331272, 42.50583018383308],
    geoType: GeoTypes.COUNTRY,
    geoValue: 'andorra',
    country: 'ad',
    slugs: { country: 'ad', pays: 'ad' }
  } as unknown as LocationAutoCompleteAddress;

  const franceCountry: LocationAutoCompleteAddress = {
    label: 'France',
    coordinates: [2.35, 48.85],
    geoType: GeoTypes.COUNTRY,
    geoValue: 'france',
    country: 'fr',
    slugs: { country: 'fr', pays: 'fr' }
  } as unknown as LocationAutoCompleteAddress;

  it.each([
    ['Andorra', andorraCountry],
    ['France', franceCountry]
  ])('falls back to the label for the %s country result', (expectedLabel, countryResult) => {
    expect(getLine1(countryResult)).toBe(expectedLabel);
    expect(getLine2(countryResult)).toBe('');
    expect(getLabel(countryResult.geoType, getLine1(countryResult), getLine2(countryResult))).toBe(
      expectedLabel
    );
  });

  it('keeps the country result selectable, with its coordinates', () => {
    const suggestion = buildSuggestion(andorraCountry);

    expect(suggestion).not.toBeNull();
    expect(suggestion?.suggestionLabel).toBe('Andorra');
    expect(suggestion?.suggestionLine1).toBe('Andorra');
    expect(suggestion?.geoValue).toBe('andorra');
    expect(suggestion?.geoType).toBe(GeoTypes.COUNTRY);
    expect(suggestion?.coordinates).toEqual([1.5255804423331272, 42.50583018383308]);
  });

  it('omits the postal code of a city result instead of printing undefined', () => {
    const cityWithoutPostalCode = {
      label: 'Andorra la Vella',
      name: 'Andorra la Vella',
      coordinates: [1.5, 42.5],
      geoType: GeoTypes.CITY,
      geoValue: 'andorra-la-vella',
      slugs: {}
    } as unknown as LocationAutoCompleteAddress;

    expect(getLine1(cityWithoutPostalCode)).toBe('Andorra la Vella');
  });

  it('drops a result that carries no text at all, rather than showing a blank row', () => {
    const emptyResult = {
      label: '',
      coordinates: [1.5, 42.5],
      geoType: GeoTypes.COUNTRY,
      geoValue: 'nowhere',
      slugs: {}
    } as unknown as LocationAutoCompleteAddress;

    expect(buildSuggestion(emptyResult)).toBeNull();
    expect(mapSuggestions([emptyResult, andorraCountry])).toHaveLength(1);
  });
});
