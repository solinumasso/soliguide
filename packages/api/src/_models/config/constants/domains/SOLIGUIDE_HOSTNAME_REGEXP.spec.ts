import { SOLIGUIDE_HOSTNAME_REGEXP } from "./SOLIGUIDE_HOSTNAME_REGEXP.const";

describe("Soliguide hostname regexp", () => {
  [
    "app.soliguide.fr",
    "soliguide.fr",
    "soliguide.dev",
    "toto.soliguide.fr",
    "demo.soliguide.dev",
    "fr.demo.soliguide.dev",
    "es.demo.soliguide.dev",
    "ad.demo.soliguide.dev",
    "soliguia.soliguide.dev",
    "soliguia.es",
    "soliguia.cat",
    "soliguia.ad.es",
  ].forEach((hostname) => {
    it(`✅ ${hostname} should match`, () => {
      expect(SOLIGUIDE_HOSTNAME_REGEXP.test(hostname)).toEqual(true);
    });
  });

  [
    "google.fr",
    "soliguide.ro",
    "toto.soliguide.ro",
    "soliguide.es",
    "app.soliguide.cat",
    "soliguia.fr",
  ].forEach((hostname) => {
    it(`❌ ${hostname} should not match`, () => {
      expect(SOLIGUIDE_HOSTNAME_REGEXP.test(hostname)).toEqual(false);
    });
  });
});
