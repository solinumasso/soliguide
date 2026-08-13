import { CountryCodes, SoliguideCountries } from "../../location";
import { SupportedLanguagesCode } from "../enums";
import { getSupportedLanguagesByCountry } from "../functions/getSupportedLanguagesByCountry";

describe("getSupportedLanguagesByCountry", () => {
  describe("France", () => {
    const languages = getSupportedLanguagesByCountry(CountryCodes.FR);

    test("starts with French, the source language", () => {
      expect(languages[0]).toBe(SupportedLanguagesCode.FR);
    });

    test("offers eleven languages", () => {
      expect(languages).toHaveLength(11);
    });

    test("does not offer Portuguese", () => {
      expect(languages).not.toContain(SupportedLanguagesCode.PT);
    });
  });

  describe.each<[string, SoliguideCountries]>([
    ["Spain", CountryCodes.ES],
    ["Andorra", CountryCodes.AD],
  ])("%s", (_countryName, country) => {
    const languages = getSupportedLanguagesByCountry(country);

    test("starts with Catalan, the source language", () => {
      expect(languages[0]).toBe(SupportedLanguagesCode.CA);
    });

    test("offers seven languages", () => {
      expect(languages).toHaveLength(7);
    });

    test("offers Portuguese", () => {
      expect(languages).toContain(SupportedLanguagesCode.PT);
    });

    test("does not offer languages that are French specific", () => {
      expect(languages).not.toContain(SupportedLanguagesCode.KA);
      expect(languages).not.toContain(SupportedLanguagesCode.RO);
      expect(languages).not.toContain(SupportedLanguagesCode.RU);
    });
  });

  test("never repeats a language", () => {
    const languages = getSupportedLanguagesByCountry(CountryCodes.ES);

    expect(new Set(languages).size).toBe(languages.length);
  });

  test("returns an empty list for a country without an interface", () => {
    // Réunion is a valid country code but has no dedicated interface
    expect(
      getSupportedLanguagesByCountry(CountryCodes.RE as SoliguideCountries)
    ).toEqual([]);
  });
});
