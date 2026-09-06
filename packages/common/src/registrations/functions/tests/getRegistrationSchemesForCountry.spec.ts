import { CountryCodes } from "../../../location";
import { SOLIGUIDE_COUNTRIES } from "../../../location/constants/SOLIGUIDE_COUNTRIES.const";
import {
  REGISTRATION_FORM_SCHEMES_BY_COUNTRY,
  REGISTRATION_SCHEMES_BY_COUNTRY,
} from "../../constants";
import { RegistrationScheme } from "../../enums";
import { getRegistrationFormSchemesForCountry } from "../getRegistrationFormSchemesForCountry";
import { getRegistrationSchemesForCountry } from "../getRegistrationSchemesForCountry";

describe("getRegistrationSchemesForCountry", () => {
  it("should cover every Soliguide country", () => {
    for (const country of SOLIGUIDE_COUNTRIES) {
      expect(REGISTRATION_SCHEMES_BY_COUNTRY[country]).toBeDefined();
      expect(getRegistrationSchemesForCountry(country).length).toBeGreaterThan(
        0
      );
    }
  });

  it("should return SIRET and RNA for France", () => {
    expect(getRegistrationSchemesForCountry(CountryCodes.FR)).toEqual([
      RegistrationScheme.SIRET,
      RegistrationScheme.RNA,
    ]);
  });

  it("should return NIF for Spain and NRT for Andorra", () => {
    expect(getRegistrationSchemesForCountry(CountryCodes.ES)).toEqual([
      RegistrationScheme.NIF,
    ]);
    expect(getRegistrationSchemesForCountry(CountryCodes.AD)).toEqual([
      RegistrationScheme.NRT,
    ]);
  });

  it.each([
    undefined,
    null,
    "",
    "XX",
    "constructor",
    "__proto__",
    "toString",
    {},
    ["FR"],
  ])(
    "should return no scheme for a value that is not a Soliguide country (%p)",
    (country) => {
      expect(getRegistrationSchemesForCountry(country)).toEqual([]);
      expect(getRegistrationFormSchemesForCountry(country)).toEqual([]);
    }
  );

  it("should only propose SIRET in French forms, RNA staying accepted", () => {
    expect(getRegistrationFormSchemesForCountry(CountryCodes.FR)).toEqual([
      RegistrationScheme.SIRET,
    ]);
  });

  it("should only propose schemes the API accepts for the country", () => {
    for (const country of SOLIGUIDE_COUNTRIES) {
      for (const scheme of REGISTRATION_FORM_SCHEMES_BY_COUNTRY[country]) {
        expect(REGISTRATION_SCHEMES_BY_COUNTRY[country]).toContain(scheme);
      }
    }
  });

  it("should never share a scheme between two countries", () => {
    const seen = new Set<RegistrationScheme>();
    for (const schemes of Object.values(REGISTRATION_SCHEMES_BY_COUNTRY)) {
      for (const scheme of schemes) {
        expect(seen.has(scheme)).toBe(false);
        seen.add(scheme);
      }
    }
  });
});
