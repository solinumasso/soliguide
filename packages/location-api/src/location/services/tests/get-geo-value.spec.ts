import {
  GeoTypes,
  LocationAutoCompleteAddress,
  CountryCodes,
} from "@soliguide/common";
import { getGeoValue } from "../get-geo-value";

describe("getGeoValue", () => {
  test("should return borough value for GeoTypes.BOROUGH", () => {
    const position = {
      geoType: GeoTypes.BOROUGH,
      city: "Paris",
      cityCode: "75119",
      postalCode: "75019",
      label: "Paris",
    } as LocationAutoCompleteAddress;
    expect(getGeoValue(position)).toBe("paris-75019");
  });

  test("should return department value for GeoTypes.DEPARTMENT", () => {
    const position = {
      geoType: GeoTypes.DEPARTMENT,
      country: CountryCodes.FR,
      department: "Paris",
      label: "Paris",
    } as LocationAutoCompleteAddress;
    expect(getGeoValue(position)).toBe("departement-paris");
  });

  test("should return region value for GeoTypes.REGION in French", () => {
    const position = {
      geoType: GeoTypes.REGION,
      country: CountryCodes.FR,
      region: "Provence-Alpes-Côte d'Azur",
      label: "PACA",
    } as LocationAutoCompleteAddress;

    expect(getGeoValue(position)).toBe("region-provence-alpes-cote-d-azur");
  });

  test("should return region value for GeoTypes.REGION in Spain", () => {
    const position = {
      geoType: GeoTypes.REGION,
      country: CountryCodes.ES,
      region: "Castilla-La Mancha",
      label: "Castilla-La Mancha",
    } as LocationAutoCompleteAddress;

    expect(getGeoValue(position)).toBe("comunidad-autonoma-castilla-la-mancha");
  });

  test("should return region value for GeoTypes.REGION in Spain", () => {
    const position = {
      geoType: GeoTypes.REGION,
      country: CountryCodes.AD,
      region: "Encamp",
      label: "Encamp",
    } as LocationAutoCompleteAddress;

    expect(getGeoValue(position)).toBe("parroquia-encamp");
  });
});
