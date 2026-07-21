import { getThemeFromCountry } from "../getThemeFromCountry";
import { CountryCodes } from "../../enums";
import { Themes } from "../../../themes";

describe("getThemeFromCountry", () => {
  it("maps France to the French theme", () => {
    expect(getThemeFromCountry(CountryCodes.FR)).toBe(Themes.SOLIGUIDE_FR);
  });

  it("maps Spain to the Spanish theme", () => {
    expect(getThemeFromCountry(CountryCodes.ES)).toBe(Themes.SOLIGUIA_ES);
  });

  it("maps Andorra to the Andorran theme", () => {
    expect(getThemeFromCountry(CountryCodes.AD)).toBe(Themes.SOLIGUIA_AD);
  });

  it("defaults to the French theme when the country is undefined", () => {
    expect(getThemeFromCountry(undefined)).toBe(Themes.SOLIGUIDE_FR);
  });
});
