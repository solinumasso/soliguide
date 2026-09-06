import { RegistrationScheme, RegistrationScope } from "@soliguide/common";

import {
  normalizeRegistrationValue,
  validateRegistrations,
} from "./validateRegistrations";

const FR_SCHEMES = [RegistrationScheme.SIRET, RegistrationScheme.RNA];

describe("validateRegistrations", () => {
  it("should return an empty map when nothing is sent", () => {
    expect(validateRegistrations(undefined, FR_SCHEMES)).toEqual({
      ok: true,
      value: {},
    });
    expect(validateRegistrations(null, FR_SCHEMES)).toEqual({
      ok: true,
      value: {},
    });
    expect(validateRegistrations({}, FR_SCHEMES)).toEqual({
      ok: true,
      value: {},
    });
  });

  it("should reject anything that is not an object", () => {
    expect(validateRegistrations("73282932000074", FR_SCHEMES)).toEqual({
      ok: false,
      error: "REGISTRATION_INVALID_FORMAT",
    });
    expect(validateRegistrations([], FR_SCHEMES).ok).toBe(false);
    expect(
      validateRegistrations({ siret: "73282932000074" }, FR_SCHEMES)
    ).toEqual({
      ok: false,
      error: "REGISTRATION_INVALID_FORMAT",
      scheme: "siret",
    });
  });

  it("should accept a valid SIRET and default the scope to organization", () => {
    expect(
      validateRegistrations({ siret: { value: "73282932000074" } }, FR_SCHEMES)
    ).toEqual({
      ok: true,
      value: {
        siret: {
          value: "73282932000074",
          scope: RegistrationScope.ORGANIZATION,
        },
      },
    });
  });

  it("should keep an explicit scope", () => {
    const result = validateRegistrations(
      { siret: { value: "73282932000074", scope: "establishment" } },
      FR_SCHEMES
    );
    expect(result.ok && result.value.siret?.scope).toBe(
      RegistrationScope.ESTABLISHMENT
    );
  });

  it("should normalize the value (spaces, dashes, case)", () => {
    expect(normalizeRegistrationValue(" 732 829 320 00074 ")).toBe(
      "73282932000074"
    );
    expect(normalizeRegistrationValue("w751234567")).toBe("W751234567");
    expect(normalizeRegistrationValue("l-123456-a")).toBe("L123456A");

    const result = validateRegistrations(
      { siret: { value: "732 829 320 00074" }, rna: { value: "w751234567" } },
      FR_SCHEMES
    );
    expect(result.ok && result.value).toEqual({
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
      rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION },
    });
  });

  it("should drop an entry whose value is empty or null (removal)", () => {
    expect(
      validateRegistrations({ siret: { value: "   " }, rna: null }, FR_SCHEMES)
    ).toEqual({ ok: true, value: {} });
  });

  it("should reject a scheme that does not belong to the country", () => {
    expect(
      validateRegistrations({ nif: { value: "G12345678" } }, FR_SCHEMES)
    ).toEqual({
      ok: false,
      error: "REGISTRATION_SCHEME_NOT_ALLOWED",
      scheme: "nif",
    });
    expect(
      validateRegistrations({ siret: { value: "73282932000074" } }, [
        RegistrationScheme.NIF,
      ]).ok
    ).toBe(false);
  });

  it("should reject an unknown scheme", () => {
    expect(
      validateRegistrations({ foo: { value: "bar" } }, FR_SCHEMES)
    ).toEqual({
      ok: false,
      error: "REGISTRATION_SCHEME_NOT_ALLOWED",
      scheme: "foo",
    });
  });

  it("should reject an unknown scope", () => {
    expect(
      validateRegistrations(
        { siret: { value: "73282932000074", scope: "siege" } },
        FR_SCHEMES
      )
    ).toEqual({
      ok: false,
      error: "REGISTRATION_SCOPE_NOT_ALLOWED",
      scheme: "siret",
    });
  });

  it("should reject an invalid value", () => {
    expect(
      validateRegistrations({ siret: { value: "73282932000075" } }, FR_SCHEMES)
    ).toEqual({
      ok: false,
      error: "REGISTRATION_INVALID_VALUE",
      scheme: "siret",
    });
    expect(
      validateRegistrations({ siret: { value: 73282932000074 } }, FR_SCHEMES)
    ).toEqual({
      ok: false,
      error: "REGISTRATION_INVALID_VALUE",
      scheme: "siret",
    });
    expect(
      validateRegistrations({ rna: { value: "751234567" } }, FR_SCHEMES).ok
    ).toBe(false);
  });
});
