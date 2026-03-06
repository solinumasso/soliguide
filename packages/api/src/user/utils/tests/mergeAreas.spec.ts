import {
  CountryAreaTerritories,
  CountryCodes,
  OperationalAreas,
} from "@soliguide/common";
import { mergeOperationalAreas } from "../mergeAreas";

describe("mergeOperationalAreas", () => {
  it("should return undefined if both areasToImport and areasToUpdate are undefined", () => {
    expect(mergeOperationalAreas()).toBeUndefined();
  });

  it("should return areasToUpdate if areasToImport is undefined", () => {
    const areasToUpdate: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["01"],
        regions: ["05"],
        cities: [{ city: "Paris", department: "01" }],
      }),
    };
    expect(mergeOperationalAreas(undefined, areasToUpdate)).toEqual(
      areasToUpdate
    );
  });

  it("should return areasToImport if areasToUpdate is undefined", () => {
    const areasToImport: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["01"],
        regions: ["05"],
        cities: [{ city: "Paris", department: "01" }],
      }),
    };
    expect(mergeOperationalAreas(areasToImport)).toEqual(areasToImport);
  });

  it("should merge areas correctly when both areasToImport and areasToUpdate are provided", () => {
    const areasToUpdate: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["01"],
        regions: ["05"],
        cities: [{ city: "Paris", department: "01" }],
      }),
    };
    const areasToImport: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["02"],
        regions: ["06"],
        cities: [{ city: "Lyon", department: "02" }],
      }),
    };
    const expectedMergedAreas: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["01", "02"],
        regions: ["05", "06"],
        cities: [
          { city: "Paris", department: "01" },
          { city: "Lyon", department: "02" },
        ],
      }),
    };
    expect(mergeOperationalAreas(areasToImport, areasToUpdate)).toEqual(
      expectedMergedAreas
    );
  });

  it("should handle different countries correctly", () => {
    const areasToUpdate: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["10"],
        regions: ["05"],
        cities: [{ city: "Paris", department: "10" }],
      }),
    };
    const areasToImport: OperationalAreas = {
      [CountryCodes.ES]: new CountryAreaTerritories({
        departments: ["02"],
        regions: ["08"],
        cities: [{ city: "Barcelona", department: "08" }],
      }),
    };

    const expectedMergedAreas: OperationalAreas = {
      [CountryCodes.FR]: new CountryAreaTerritories({
        departments: ["10"],
        regions: ["05"],
        cities: [{ city: "Paris", department: "10" }],
      }),
      [CountryCodes.ES]: new CountryAreaTerritories({
        departments: ["02"],
        regions: ["08"],
        cities: [{ city: "Barcelona", department: "08" }],
      }),
    };

    expect(mergeOperationalAreas(areasToImport, areasToUpdate)).toEqual(
      expectedMergedAreas
    );
  });
});
