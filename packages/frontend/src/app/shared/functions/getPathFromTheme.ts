import { LEGAL_PAGE_SLUGS_BY_THEME, LegalPage } from "@soliguide/common";
import { themeService } from "../services";

/**
 * Localized slug of a legal page for the current theme, without a language
 * segment. Used for in-app links, which the router prefixes with the language.
 */
export const getPathFromTheme = (page: LegalPage): string => {
  return LEGAL_PAGE_SLUGS_BY_THEME[page][themeService.getTheme()];
};
