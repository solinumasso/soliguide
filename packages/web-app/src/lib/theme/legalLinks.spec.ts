import { describe, expect, it } from 'vitest';
import { LegalPage, Themes } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition } from './buildThemeDefinition';
import { buildLegalLinks } from './legalLinks';

const buildTheme = (name: Themes) => buildThemeDefinition(THEME_BLUEPRINTS[name], {});

describe('buildLegalLinks', () => {
  it('links to the Spanish website in Catalan, its default language', () => {
    expect(buildLegalLinks(buildTheme(Themes.SOLIGUIA_ES))).toEqual({
      [LegalPage.LEGAL_NOTICES]: 'https://soliguia.cat/ca/informacion-legal',
      [LegalPage.PRIVACY_POLICY]: 'https://soliguia.cat/ca/politica-privacidad',
      [LegalPage.DATA_PROCESSING_AGREEMENT]: 'https://soliguia.cat/ca/acuerdo-proteccion-datos',
      [LegalPage.COOKIE_POLICY]: 'https://soliguia.cat/ca/politica-cookies',
      [LegalPage.GCU]: 'https://soliguia.cat/ca/cgu'
    });
  });

  it('links to the Andorran website in Catalan, its default language', () => {
    expect(buildLegalLinks(buildTheme(Themes.SOLIGUIA_AD))).toEqual({
      [LegalPage.LEGAL_NOTICES]: 'https://soliguia.ad/ca/avis-legal',
      [LegalPage.PRIVACY_POLICY]: 'https://soliguia.ad/ca/politica-privacitat',
      [LegalPage.DATA_PROCESSING_AGREEMENT]: 'https://soliguia.ad/ca/acord-proteccio-dades',
      [LegalPage.COOKIE_POLICY]: 'https://soliguia.ad/ca/politica-cookies',
      [LegalPage.GCU]: 'https://soliguia.ad/ca/cgu'
    });
  });

  it('links to the French website in French, its default language', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIDE_FR));

    expect(legalLinks[LegalPage.LEGAL_NOTICES]).toBe('https://soliguide.fr/fr/mentions-legales');
    expect(legalLinks[LegalPage.GCU]).toBe('https://soliguide.fr/fr/cgu');
  });

  // The website of a country publishes these documents in one language only, so
  // the visitor's language must never reach the URL
  it.each(Object.values(Themes))(
    'uses the default language of %s and nothing else',
    (themeName) => {
      const theme = buildTheme(themeName);
      const languageSegments = Object.values(buildLegalLinks(theme)).map(
        (url) => new URL(url).pathname.split('/')[1]
      );

      expect(new Set(languageSegments)).toEqual(new Set([theme.defaultLanguage]));
    }
  );
});
