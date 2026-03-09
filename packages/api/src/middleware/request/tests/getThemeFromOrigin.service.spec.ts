import { CONFIG } from "../../../_models/config/constants/CONFIG.const";
import { Themes } from "@soliguide/common";
import { getThemeFromOrigin } from "../services/getThemeFromOrigin.service";

describe("getThemeFromOrigin", () => {
  it.each([
    [CONFIG.SOLIGUIA_AD_URL, Themes.SOLIGUIA_AD],
    [CONFIG.SOLIGUIA_ES_URL, Themes.SOLIGUIA_ES],
    [CONFIG.SOLIGUIDE_FR_URL, Themes.SOLIGUIDE_FR],
  ])("should set correct theme for frontend url %s", (url, expectedTheme) => {
    expect(getThemeFromOrigin(url)).toEqual(expectedTheme);
  });

  it.each([
    [CONFIG.WEBAPP_AD_URL, Themes.SOLIGUIA_AD],
    [CONFIG.WEBAPP_ES_URL, Themes.SOLIGUIA_ES],
    [CONFIG.WEBAPP_FR_URL, Themes.SOLIGUIDE_FR],
  ])("should set correct theme for webapp url %s", (url, expectedTheme) => {
    expect(getThemeFromOrigin(url)).toEqual(expectedTheme);
  });

  it("should set theme to SOLIGUIDE_FR when origin is app.soliguide.fr", () => {
    expect(
      getThemeFromOrigin(
        "https://app.soliguide.fr/ro/places?lang=fr&location=63bis-rue-victor-hugo-94140-alfortville&latitude=2.42236&longitude=48.804131&type=position&label=63bis+Rue+Victor+Hugo%2C+94140+Alfortville&category=food"
      )
    ).toEqual(Themes.SOLIGUIDE_FR);
  });

  it("should set theme to SOLIGUIDE_FR when origin is SOLIGUIDE_FR domain (double https)", () => {
    expect(getThemeFromOrigin(`https://${CONFIG.SOLIGUIDE_FR_URL}`)).toEqual(
      Themes.SOLIGUIDE_FR
    );
  });

  it("should set theme to null when origin is not a known domain", () => {
    expect(getThemeFromOrigin("https://unknown.com")).toEqual(null);
  });
});
