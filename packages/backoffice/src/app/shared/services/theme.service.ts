import { Themes } from "@soliguide/common";

class ThemeService {
  theme: Themes;

  constructor() {
    if (window.CURRENT_DATA?.THEME?.length) {
      this.theme = window.CURRENT_DATA.THEME;
    } else {
      throw new Error("Theme not defined");
    }
  }

  public getTheme(): Themes {
    return this.theme;
  }

  public isSoliguideFr(): boolean {
    return this.theme === Themes.SOLIGUIDE_FR;
  }

  public isSoliguiaEs(): boolean {
    return this.theme === Themes.SOLIGUIA_ES;
  }

  public isSoliguiaAd(): boolean {
    return this.theme === Themes.SOLIGUIA_AD;
  }
}

// Not injectable service to use in constants file
export const themeService = new ThemeService();
