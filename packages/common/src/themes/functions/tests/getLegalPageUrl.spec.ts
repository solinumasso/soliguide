import { LegalPage } from "../../enums";
import { Themes } from "../../themes.enum";
import { getLegalPagePath, getLegalPageUrl } from "../getLegalPageUrl";

describe("getLegalPageUrl", () => {
  describe("Soliguide France", () => {
    test.each([
      [LegalPage.LEGAL_NOTICES, "https://soliguide.fr/fr/mentions-legales"],
      [
        LegalPage.PRIVACY_POLICY,
        "https://soliguide.fr/fr/politique-confidentialite",
      ],
      [
        LegalPage.DATA_PROCESSING_AGREEMENT,
        "https://soliguide.fr/fr/accord-protection-donnees",
      ],
      [LegalPage.COOKIE_POLICY, "https://soliguide.fr/fr/politique-cookies"],
      [LegalPage.GCU, "https://soliguide.fr/fr/cgu"],
    ])("builds the %s URL", (page, expectedUrl) => {
      expect(getLegalPageUrl(Themes.SOLIGUIDE_FR, page, "fr")).toBe(
        expectedUrl
      );
    });
  });

  describe("Soliguia Spain", () => {
    test.each([
      [LegalPage.LEGAL_NOTICES, "https://soliguia.cat/ca/informacion-legal"],
      [LegalPage.PRIVACY_POLICY, "https://soliguia.cat/ca/politica-privacidad"],
      [
        LegalPage.DATA_PROCESSING_AGREEMENT,
        "https://soliguia.cat/ca/acuerdo-proteccion-datos",
      ],
      [LegalPage.COOKIE_POLICY, "https://soliguia.cat/ca/politica-cookies"],
      [LegalPage.GCU, "https://soliguia.cat/ca/cgu"],
    ])("builds the %s URL", (page, expectedUrl) => {
      expect(getLegalPageUrl(Themes.SOLIGUIA_ES, page, "ca")).toBe(expectedUrl);
    });
  });

  describe("Soliguia Andorra", () => {
    test.each([
      [LegalPage.LEGAL_NOTICES, "https://soliguia.ad/ca/avis-legal"],
      [LegalPage.PRIVACY_POLICY, "https://soliguia.ad/ca/politica-privacitat"],
      [
        LegalPage.DATA_PROCESSING_AGREEMENT,
        "https://soliguia.ad/ca/acord-proteccio-dades",
      ],
      [LegalPage.COOKIE_POLICY, "https://soliguia.ad/ca/politica-cookies"],
      [LegalPage.GCU, "https://soliguia.ad/ca/cgu"],
    ])("builds the %s URL", (page, expectedUrl) => {
      expect(getLegalPageUrl(Themes.SOLIGUIA_AD, page, "ca")).toBe(expectedUrl);
    });
  });

  test("uses the requested language as the first path segment", () => {
    expect(getLegalPageUrl(Themes.SOLIGUIA_ES, LegalPage.GCU, "uk")).toBe(
      "https://soliguia.cat/uk/cgu"
    );
  });
});

describe("getLegalPagePath", () => {
  test("returns a relative path without a scheme or a hostname", () => {
    expect(
      getLegalPagePath(Themes.SOLIGUIA_AD, LegalPage.PRIVACY_POLICY, "ca")
    ).toBe("ca/politica-privacitat");
  });

  test("keeps the Angular router language placeholder usable", () => {
    expect(
      getLegalPagePath(Themes.SOLIGUIDE_FR, LegalPage.LEGAL_NOTICES, ":lang")
    ).toBe(":lang/mentions-legales");
  });
});
