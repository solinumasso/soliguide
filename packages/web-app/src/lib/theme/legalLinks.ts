import { getLegalPageUrl, LegalPage } from '@soliguide/common';

import type { ThemeDefinition, ThemeLegalLinks } from './types';

/**
 * Absolute URLs of the legal documents of a theme, in the country's default
 * language.
 *
 * Deliberately independent of the language the visitor selected: each country's
 * website publishes these documents in one language only, and any other
 * language segment falls back to the French Soliguide version. The default
 * language is the only segment that always lands on the country's own document.
 */
export const buildLegalLinks = (theme: ThemeDefinition): ThemeLegalLinks =>
  Object.values(LegalPage).reduce(
    (legalLinks, page) => ({
      ...legalLinks,
      [page]: getLegalPageUrl(theme.name, page, theme.defaultLanguage)
    }),
    {} as ThemeLegalLinks
  );
