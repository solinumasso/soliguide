import { LEGAL_PAGE_SLUGS_BY_THEME, WEBSITE_URL_BY_THEME } from "../constants";
import { LegalPage } from "../enums";
import { Themes } from "../themes.enum";

/**
 * Path of a legal page on its own website, language segment included
 * (e.g. `ca/politica-privacitat`). Used by the Angular router, which serves
 * these pages locally.
 */
export const getLegalPagePath = (
  theme: Themes,
  page: LegalPage,
  lang: string
): string => `${lang}/${LEGAL_PAGE_SLUGS_BY_THEME[page][theme]}`;

/**
 * Absolute URL of a legal page. Used by the web-app, which links out to the
 * country's website instead of hosting these documents itself.
 */
export const getLegalPageUrl = (
  theme: Themes,
  page: LegalPage,
  lang: string
): string =>
  `https://${WEBSITE_URL_BY_THEME[theme]}/${getLegalPagePath(
    theme,
    page,
    lang
  )}`;
