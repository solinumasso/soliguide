import { RegistrationScheme, RegistrationScope } from "../../enums";
import { buildRegistrationsPayload } from "../buildRegistrationsPayload";

describe("buildRegistrationsPayload", () => {
  it("should create entries with the default scope", () => {
    expect(
      buildRegistrationsPayload(
        {},
        { siret: "73282932000074", rna: "W751234567" }
      )
    ).toEqual({
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
      rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION },
    });
  });

  it("should trim values and keep an existing scope", () => {
    expect(
      buildRegistrationsPayload(
        {
          siret: {
            value: "55210055400013",
            scope: RegistrationScope.ESTABLISHMENT,
          },
        },
        { [RegistrationScheme.SIRET]: " 73282932000074 " }
      )
    ).toEqual({
      siret: {
        value: "73282932000074",
        scope: RegistrationScope.ESTABLISHMENT,
      },
    });
  });

  it("should set a scheme to null when its input is emptied (removal)", () => {
    expect(
      buildRegistrationsPayload(
        { siret: { value: "73282932000074", scope: RegistrationScope.HOST } },
        { siret: "", rna: null }
      )
    ).toEqual({ siret: null, rna: null });
    expect(buildRegistrationsPayload(undefined, { siret: undefined })).toEqual({
      siret: null,
    });
  });

  it("should leave schemes absent from the form untouched", () => {
    expect(
      buildRegistrationsPayload(
        { rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION } },
        { siret: "73282932000074" }
      )
    ).toEqual({
      rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION },
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
    });
  });
});
