import { describe, expect, it } from 'vitest';
import { CountryCodes, SupportedLanguagesCode, Themes } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition, getHostnamesEnvKey } from './buildThemeDefinition';

const PUBLIC_ENV = {
  PUBLIC_SOLIGUIDE_FR_HOSTNAMES: 'app.soliguide.fr',
  PUBLIC_SOLIGUIA_ES_HOSTNAMES: 'app.soliguia.es,app.soliguia.cat',
  PUBLIC_SOLIGUIA_AD_HOSTNAMES: 'app.soliguia.ad'
};

const buildTheme = (name: Themes) => buildThemeDefinition(THEME_BLUEPRINTS[name], PUBLIC_ENV);

describe('getHostnamesEnvKey', () => {
  it.each([
    [Themes.SOLIGUIDE_FR, 'PUBLIC_SOLIGUIDE_FR_HOSTNAMES'],
    [Themes.SOLIGUIA_ES, 'PUBLIC_SOLIGUIA_ES_HOSTNAMES'],
    [Themes.SOLIGUIA_AD, 'PUBLIC_SOLIGUIA_AD_HOSTNAMES']
  ])('derives the environment variable name of %s', (theme, expectedKey) => {
    expect(getHostnamesEnvKey(theme)).toBe(expectedKey);
  });
});

describe('buildThemeDefinition', () => {
  describe('Soliguide France', () => {
    const theme = buildTheme(Themes.SOLIGUIDE_FR);

    it('is branded Soliguide', () => {
      expect(theme.brandName).toBe('Soliguide');
    });

    it('opens in French', () => {
      expect(theme.country).toBe(CountryCodes.FR);
      expect(theme.defaultLanguage).toBe(SupportedLanguagesCode.FR);
      expect(theme.supportedLanguages[0]).toBe(SupportedLanguagesCode.FR);
    });

    it('offers the practical files and the translator programme', () => {
      expect(theme.capabilities.practicalFiles).toBe(true);
      expect(theme.capabilities.becomeTranslator).toBe(true);
      expect(theme.capabilities.cookieManagement).toBe(true);
      expect(theme.links.practicalFiles).toBe('https://support.soliguide.fr/hc/fr');
      expect(theme.links.becomeTranslator).toBe('https://airtable.com/shrZHYio1ZdnPl1Et');
    });

    it('points to the Solinum website', () => {
      expect(theme.organization.name).toBe('Solinum');
      expect(theme.links.organizationSite).toBe('https://www.solinum.org/');
    });

    it('serves its own hostname', () => {
      expect(theme.hostnames).toEqual(['app.soliguide.fr']);
    });
  });

  describe.each([
    ['Soliguia Spain', Themes.SOLIGUIA_ES, CountryCodes.ES],
    ['Soliguia Andorra', Themes.SOLIGUIA_AD, CountryCodes.AD]
  ])('%s', (_label, themeName, expectedCountry) => {
    const theme = buildTheme(themeName);

    it('is branded Soliguia', () => {
      expect(theme.brandName).toBe('Soliguia');
    });

    it('opens in Catalan', () => {
      expect(theme.country).toBe(expectedCountry);
      expect(theme.defaultLanguage).toBe(SupportedLanguagesCode.CA);
      expect(theme.supportedLanguages[0]).toBe(SupportedLanguagesCode.CA);
    });

    it('offers seven languages, Portuguese included', () => {
      expect(theme.supportedLanguages).toHaveLength(7);
      expect(theme.supportedLanguages).toContain(SupportedLanguagesCode.PT);
    });

    it('has no practical files, no cookie management, no translator programme and no chat', () => {
      expect(theme.capabilities).toEqual({
        practicalFiles: false,
        cookieManagement: false,
        becomeTranslator: false,
        chat: false
      });
      expect(theme.links.practicalFiles).toBeNull();
      expect(theme.links.becomeTranslator).toBeNull();
    });

    it('points to the Solidigital website', () => {
      expect(theme.organization.name).toBe('Solidigital');
      expect(theme.links.organizationSite).toBe('https://solidigital.org/');
    });

    it('serves its assets from its own directory', () => {
      expect(theme.media.assetsDirectory).toBe(themeName);
      expect(theme.media.logos.inline).toBe(`/images/themes/${themeName}/logo-inline.svg`);
      expect(theme.media.illustrations.languageSelection).toBe(
        `/images/themes/${themeName}/illustration-language-selection.svg`
      );
    });
  });

  it('gives the Spanish theme both of its hostnames', () => {
    expect(buildTheme(Themes.SOLIGUIA_ES).hostnames).toEqual([
      'app.soliguia.es',
      'app.soliguia.cat'
    ]);
  });

  it('leaves a theme without a configured hostname unreachable', () => {
    const theme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIA_ES], {});

    expect(theme.hostnames).toEqual([]);
  });

  // Guards against a country being only half declared
  it.each(Object.values(Themes))('declares a blueprint for %s', (themeName) => {
    expect(THEME_BLUEPRINTS[themeName]).toBeDefined();
    expect(THEME_BLUEPRINTS[themeName].name).toBe(themeName);
  });

  it.each(Object.values(Themes))('builds a complete definition for %s', (themeName) => {
    const theme = buildTheme(themeName);

    expect(theme.brandName).toBeTruthy();
    expect(theme.supportedLanguages.length).toBeGreaterThan(0);
    expect(theme.supportedLanguages).toContain(theme.defaultLanguage);
    expect(theme.links.organizationSite).toMatch(/^https:\/\//u);
  });
});
