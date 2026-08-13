import { getLegalPageUrl, LegalPage, type SupportedLanguagesCode } from '@soliguide/common';

import type { ThemeDefinition, ThemeLegalLinks } from './types';

/**
 * Absolute URLs of the legal documents of a theme, in the requested language.
 *
 * These documents are hosted by the country's own website, which only publishes
 * them in the languages that website supports, so an unsupported language falls
 * back to the theme's default language rather than producing a dead link.
 */
export const buildLegalLinks = (
  theme: ThemeDefinition,
  language: SupportedLanguagesCode | string
): ThemeLegalLinks => {
  const targetLanguage = theme.supportedLanguages.includes(language as SupportedLanguagesCode)
    ? language
    : theme.defaultLanguage;

  return Object.values(LegalPage).reduce(
    (legalLinks, page) => ({
      ...legalLinks,
      [page]: getLegalPageUrl(theme.name, page, targetLanguage)
    }),
    {} as ThemeLegalLinks
  );
};
