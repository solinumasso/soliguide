import { RegistrationScheme } from "../../enums";
import { getRegistrationRegistryUrl } from "../getRegistrationRegistryUrl";

describe("getRegistrationRegistryUrl", () => {
  it("should build the establishment page for a SIRET", () => {
    expect(
      getRegistrationRegistryUrl(RegistrationScheme.SIRET, "73282932000074")
    ).toBe(
      "https://annuaire-entreprises.data.gouv.fr/etablissement/73282932000074"
    );
  });

  it("should build the association page for a RNA", () => {
    expect(
      getRegistrationRegistryUrl(RegistrationScheme.RNA, "W751234567")
    ).toBe("https://www.data-asso.fr/annuaire/association/W751234567");
  });

  it("should return the search page for a NIF", () => {
    expect(
      getRegistrationRegistryUrl(RegistrationScheme.NIF, "Q2826000H")
    ).toBe("https://sede.mir.gob.es/nfrontal/webasocia2.html");
  });

  it("should return null when there is no registry or no value", () => {
    expect(getRegistrationRegistryUrl(RegistrationScheme.NRT, "L123456A")).toBe(
      null
    );
    expect(getRegistrationRegistryUrl(RegistrationScheme.SIRET, "")).toBe(null);
  });
});
