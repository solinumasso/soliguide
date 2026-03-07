import { CountryCodes, GeoTypes, SoliguideCountries } from "../../enums";
import { extractGeoTypeFromSearch } from "../extract-geo-type-from-search";

describe("extractGeoTypeFromSearch", () => {
  it("should return DEPARTMENT for a valid department search in France", () => {
    const result = extractGeoTypeFromSearch(
      "departement-haute-garonne",
      CountryCodes.FR
    );
    expect(result.geoType).toBe(GeoTypes.DEPARTMENT);
  });

  it("should return REGION for a valid region search in France", () => {
    const result = extractGeoTypeFromSearch(
      "region-occitanie",
      CountryCodes.FR
    );
    expect(result.geoType).toBe(GeoTypes.REGION);
  });

  it("should return DEPARTMENT for a valid provincia search in Spain", () => {
    const result = extractGeoTypeFromSearch(
      "provincia-barcelona",
      CountryCodes.ES
    );
    expect(result.geoType).toBe(GeoTypes.DEPARTMENT);
  });

  it("should return REGION for a valid comunidad-autonoma search in Spain", () => {
    const result = extractGeoTypeFromSearch(
      "comunidad-autonoma-cataluna",
      CountryCodes.ES
    );
    expect(result.geoType).toBe(GeoTypes.REGION);
  });

  it("should return REGION for a valid parroquia search in Andorra", () => {
    const result = extractGeoTypeFromSearch(
      "parroquia-andorra-la-vella",
      CountryCodes.AD
    );
    expect(result.geoType).toBe(GeoTypes.REGION);
  });

  it("should return null for a search without a geo prefix in France", () => {
    const result = extractGeoTypeFromSearch("paris", CountryCodes.FR);
    expect(result.geoType).toBeNull();
  });

  it("should return null for a search with an invalid geo prefix in France", () => {
    const result = extractGeoTypeFromSearch(
      "province-ile-de-france",
      CountryCodes.FR
    );
    expect(result.geoType).toBeNull();
  });

  it("should return null for a search in an unsupported country", () => {
    const result = extractGeoTypeFromSearch(
      "region-lombardia",
      "IT" as SoliguideCountries
    );
    expect(result.geoType).toBeNull();
  });

  it("should handle case sensitivity correctly", () => {
    const result = extractGeoTypeFromSearch("Region-Bretagne", CountryCodes.FR);
    expect(result.geoType).toEqual(GeoTypes.REGION);
    expect(result.search).toEqual("bretagne");
  });

  it("should handle spaces in the search string", () => {
    const result = extractGeoTypeFromSearch(
      "departement- haute-garonne",
      CountryCodes.FR
    );
    expect(result.geoType).toEqual(GeoTypes.DEPARTMENT);
    expect(result.search).toEqual("haute-garonne");
  });
});
