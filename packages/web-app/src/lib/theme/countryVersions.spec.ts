import { describe, expect, it } from 'vitest';
import { CountryCodes, Themes, type SoliguideCountries } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition } from './buildThemeDefinition';
import { buildCountryVersions, buildCountryVersionUrl, getCountryNameKey } from './countryVersions';

const PUBLIC_ENV = {
  PUBLIC_SOLIGUIDE_FR_HOSTNAMES: 'app.soliguide.fr',
  PUBLIC_SOLIGUIA_ES_HOSTNAMES: 'app.soliguia.es,es.app.demo.soliguide.dev',
  PUBLIC_SOLIGUIA_AD_HOSTNAMES: 'app.soliguia.ad'
};

const buildRegistry = (publicEnv: Record<string, string | undefined> = PUBLIC_ENV) =>
  Object.values(THEME_BLUEPRINTS).map((blueprint) => buildThemeDefinition(blueprint, publicEnv));

const findTheme = (name: Themes) => {
  const theme = buildRegistry().find((candidate) => candidate.name === name);

  if (!theme) {
    throw new Error(`No theme built for ${name}`);
  }

  return theme;
};

const COUNTRY_NAME_KEYS: [SoliguideCountries, string][] = [
  [CountryCodes.FR, 'COUNTRY_NAME_FR'],
  [CountryCodes.ES, 'COUNTRY_NAME_ES'],
  [CountryCodes.AD, 'COUNTRY_NAME_AD']
];

describe('getCountryNameKey', () => {
  it.each(COUNTRY_NAME_KEYS)('derives the translation key of %s', (country, expectedKey) => {
    expect(getCountryNameKey(country)).toBe(expectedKey);
  });
});

describe('buildCountryVersions', () => {
  it('offers the other countries to a French visitor', () => {
    const versions = buildCountryVersions(findTheme(Themes.SOLIGUIDE_FR), buildRegistry());

    expect(versions.map((version) => version.theme)).toEqual([
      Themes.SOLIGUIA_ES,
      Themes.SOLIGUIA_AD
    ]);
  });

  it('never offers the country the visitor is already on', () => {
    const versions = buildCountryVersions(findTheme(Themes.SOLIGUIA_ES), buildRegistry());

    expect(versions.map((version) => version.theme)).toEqual([
      Themes.SOLIGUIDE_FR,
      Themes.SOLIGUIA_AD
    ]);
  });

  it('describes a country with its brand, its name key and its canonical hostname', () => {
    const [spain] = buildCountryVersions(findTheme(Themes.SOLIGUIDE_FR), buildRegistry());

    expect(spain).toEqual({
      theme: Themes.SOLIGUIA_ES,
      country: CountryCodes.ES,
      brandName: 'Soliguia',
      nameKey: 'COUNTRY_NAME_ES',
      hostname: 'app.soliguia.es'
    });
  });

  it('leaves out a country with no configured hostname, which is unreachable', () => {
    const registry = buildRegistry({ ...PUBLIC_ENV, PUBLIC_SOLIGUIA_AD_HOSTNAMES: '' });
    const versions = buildCountryVersions(findTheme(Themes.SOLIGUIDE_FR), registry);

    expect(versions.map((version) => version.theme)).toEqual([Themes.SOLIGUIA_ES]);
  });
});

describe('buildCountryVersionUrl', () => {
  const [spain] = buildCountryVersions(findTheme(Themes.SOLIGUIDE_FR), buildRegistry());

  it('targets the home page, never the path of the current country', () => {
    const url = buildCountryVersionUrl(spain, new URL('https://app.soliguide.fr/fr/fiche/1234'));

    expect(url).toBe('https://app.soliguia.es/');
  });

  it('keeps the scheme and the port the visitor is browsing on', () => {
    const url = buildCountryVersionUrl(
      { ...spain, hostname: 'es.localhost' },
      new URL('http://fr.localhost:5173/fr')
    );

    expect(url).toBe('http://es.localhost:5173/');
  });
});
