import { describe, expect, it } from 'vitest';
import { LegalPage, SupportedLanguagesCode, Themes } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition } from './buildThemeDefinition';
import { buildLegalLinks } from './legalLinks';

const buildTheme = (name: Themes) => buildThemeDefinition(THEME_BLUEPRINTS[name], {});

describe('buildLegalLinks', () => {
  it('links to the Spanish website in Catalan', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIA_ES), SupportedLanguagesCode.CA);

    expect(legalLinks).toEqual({
      [LegalPage.LEGAL_NOTICES]: 'https://soliguia.cat/ca/informacion-legal',
      [LegalPage.PRIVACY_POLICY]: 'https://soliguia.cat/ca/politica-privacidad',
      [LegalPage.DATA_PROCESSING_AGREEMENT]: 'https://soliguia.cat/ca/acuerdo-proteccion-datos',
      [LegalPage.COOKIE_POLICY]: 'https://soliguia.cat/ca/politica-cookies',
      [LegalPage.GCU]: 'https://soliguia.cat/ca/cgu'
    });
  });

  it('links to the Andorran website in Catalan', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIA_AD), SupportedLanguagesCode.CA);

    expect(legalLinks[LegalPage.LEGAL_NOTICES]).toBe('https://soliguia.ad/ca/avis-legal');
    expect(legalLinks[LegalPage.PRIVACY_POLICY]).toBe('https://soliguia.ad/ca/politica-privacitat');
  });

  it('links to the French website in French', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIDE_FR), SupportedLanguagesCode.FR);

    expect(legalLinks[LegalPage.LEGAL_NOTICES]).toBe('https://soliguide.fr/fr/mentions-legales');
  });

  it('follows the language the visitor selected', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIA_ES), SupportedLanguagesCode.UK);

    expect(legalLinks[LegalPage.GCU]).toBe('https://soliguia.cat/uk/cgu');
  });

  it('falls back to the default language when the website does not publish it', () => {
    // Georgian is offered in France only, so the Spanish website has no such page
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIA_ES), SupportedLanguagesCode.KA);

    expect(legalLinks[LegalPage.GCU]).toBe('https://soliguia.cat/ca/cgu');
  });

  it('falls back to the default language for an unknown language', () => {
    const legalLinks = buildLegalLinks(buildTheme(Themes.SOLIGUIDE_FR), 'xx');

    expect(legalLinks[LegalPage.GCU]).toBe('https://soliguide.fr/fr/cgu');
  });
});
