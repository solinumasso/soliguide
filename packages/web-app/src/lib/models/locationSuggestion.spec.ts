import { GeoTypes, type LocationAutoCompleteAddress } from '@soliguide/common';
import { describe, expect, it } from 'vitest';
import { getLabel, getLine1, getLine2 } from './locationSuggestion';

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
