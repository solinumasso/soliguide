import { CountryCodes, Themes } from "@soliguide/common";

import { getThemeAndUrlFromUser } from "./getThemeAndUrlFromUser";

describe("getThemeAndUrlFromUser", () => {
  it("derives the Spanish theme from an ES area", () => {
    const { theme, frontendUrl } = getThemeAndUrlFromUser({
      areas: { [CountryCodes.ES]: {} },
    } as never);

    expect(theme).toBe(Themes.SOLIGUIA_ES);
    expect(frontendUrl.endsWith("/")).toBe(true);
  });

  it("derives the Andorran theme from an AD area", () => {
    const { theme } = getThemeAndUrlFromUser({
      areas: { [CountryCodes.AD]: {} },
    } as never);

    expect(theme).toBe(Themes.SOLIGUIA_AD);
  });

  it("derives the French theme from an FR area", () => {
    const { theme } = getThemeAndUrlFromUser({
      areas: { [CountryCodes.FR]: {} },
    } as never);

    expect(theme).toBe(Themes.SOLIGUIDE_FR);
  });

  it("falls back to the French theme when areas is empty", () => {
    const { theme } = getThemeAndUrlFromUser({ areas: {} } as never);

    expect(theme).toBe(Themes.SOLIGUIDE_FR);
  });

  it("falls back to the French theme when areas is undefined", () => {
    const { theme } = getThemeAndUrlFromUser({ areas: undefined } as never);

    expect(theme).toBe(Themes.SOLIGUIDE_FR);
  });
});
