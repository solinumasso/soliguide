import type { SupportedLanguagesCode } from '@soliguide/common';

import type { ThemeDefinition } from './types';

/**
 * The language a request is for, taken from the first path segment.
 *
 * Routes are shaped `/{lang}/...`, but `/languages` has no language segment and
 * the segment may name a language the theme does not offer, so anything the
 * theme does not support falls back to its default language.
 */
export const getRequestLanguage = (
  pathname: string,
  theme: ThemeDefinition
): SupportedLanguagesCode => {
  const [firstSegment] = pathname.split('/').filter(Boolean);

  return theme.supportedLanguages.includes(firstSegment as SupportedLanguagesCode)
    ? (firstSegment as SupportedLanguagesCode)
    : theme.defaultLanguage;
};
