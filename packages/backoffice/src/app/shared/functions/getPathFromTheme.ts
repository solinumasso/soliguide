import { Themes } from "@soliguide/common";

import { themeService } from "../services";

type StaticPagePaths = {
  [keyPath: string]: {
    [Themes.SOLIGUIDE_FR]: string;
    [Themes.SOLIGUIA_AD]: string;
    [Themes.SOLIGUIA_ES]: string;
  };
};

const STATIC_PAGE_PATHS_BY_THEME: StaticPagePaths = {
  "legal-notices": {
    [Themes.SOLIGUIDE_FR]: "mentions-legales",
    [Themes.SOLIGUIA_AD]: "avis-legal",
    [Themes.SOLIGUIA_ES]: "informacion-legal",
  },
  "privacy-policy": {
    [Themes.SOLIGUIDE_FR]: "politique-confidentialite",
    [Themes.SOLIGUIA_AD]: "politica-privacitat",
    [Themes.SOLIGUIA_ES]: "politica-privacidad",
  },
  "data-processing-agreement": {
    [Themes.SOLIGUIDE_FR]: "accord-protection-donnees",
    [Themes.SOLIGUIA_AD]: "acord-proteccio-dades",
    [Themes.SOLIGUIA_ES]: "acuerdo-proteccion-datos",
  },
  "cookie-policy": {
    [Themes.SOLIGUIDE_FR]: "politique-cookies",
    [Themes.SOLIGUIA_AD]: "politica-cookies",
    [Themes.SOLIGUIA_ES]: "politica-cookies",
  },
  gcu: {
    [Themes.SOLIGUIDE_FR]: "cgu",
    [Themes.SOLIGUIA_AD]: "cgu",
    [Themes.SOLIGUIA_ES]: "cgu",
  },
};

export const getPathFromTheme = (pathKey: string): string => {
  return STATIC_PAGE_PATHS_BY_THEME[pathKey][themeService.getTheme()];
};
