import { describe, expect, it } from 'vitest';
import { SupportedLanguagesCode, Themes } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition } from './buildThemeDefinition';
import { getRequestLanguage } from './getRequestLanguage';

const frenchTheme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIDE_FR], {});
const spanishTheme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIA_ES], {});

describe('getRequestLanguage', () => {
  it('reads the language from the first path segment', () => {
    expect(getRequestLanguage('/ar/search', frenchTheme)).toBe(SupportedLanguagesCode.AR);
  });

  it('works without a trailing path', () => {
    expect(getRequestLanguage('/uk', spanishTheme)).toBe(SupportedLanguagesCode.UK);
  });

  it.each([
    ['the root path', '/'],
    ['an empty path', ''],
    ['the language selection page', '/languages']
  ])('falls back to the default language on %s', (_label, pathname) => {
    expect(getRequestLanguage(pathname, spanishTheme)).toBe(SupportedLanguagesCode.CA);
  });

  it('falls back to the default language when the theme does not offer the language', () => {
    // Georgian is offered in France only
    expect(getRequestLanguage('/ka/search', spanishTheme)).toBe(SupportedLanguagesCode.CA);
    expect(getRequestLanguage('/ka/search', frenchTheme)).toBe(SupportedLanguagesCode.KA);
  });

  it('falls back to the default language on an unknown segment', () => {
    expect(getRequestLanguage('/not-a-language/search', frenchTheme)).toBe(
      SupportedLanguagesCode.FR
    );
  });
});
