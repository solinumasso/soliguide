import { describe, expect, it } from 'vitest';
import { Themes } from '@soliguide/common';

import { matchThemeByHostname, normalizeHostname, parseHostnameList } from './hostnameMatching';
import type { ThemeDefinition } from './types';

const buildTheme = (name: Themes, hostnames: string[]): ThemeDefinition =>
  ({ name, hostnames }) as ThemeDefinition;

const THEMES = [
  buildTheme(Themes.SOLIGUIDE_FR, ['app.soliguide.fr']),
  buildTheme(Themes.SOLIGUIA_ES, ['app.soliguia.es', 'app.soliguia.cat']),
  buildTheme(Themes.SOLIGUIA_AD, ['app.soliguia.ad'])
];

describe('normalizeHostname', () => {
  it.each([
    ['a bare hostname', 'app.soliguia.es', 'app.soliguia.es'],
    ['an https origin', 'https://app.soliguia.es', 'app.soliguia.es'],
    ['an http origin', 'http://app.soliguia.es', 'app.soliguia.es'],
    ['an origin with a path', 'https://app.soliguia.es/languages', 'app.soliguia.es'],
    ['a port', 'app.soliguia.es:8443', 'app.soliguia.es'],
    ['a scheme and a port', 'https://app.soliguia.es:443/', 'app.soliguia.es'],
    ['mixed case', 'APP.Soliguia.ES', 'app.soliguia.es'],
    ['a www prefix', 'www.soliguia.es', 'soliguia.es'],
    ['a trailing dot', 'app.soliguia.es.', 'app.soliguia.es'],
    ['surrounding whitespace', '  app.soliguia.es  ', 'app.soliguia.es'],
    ['localhost with a port', 'localhost:5173', 'localhost']
  ])('normalizes %s', (_label, value, expected) => {
    expect(normalizeHostname(value)).toBe(expected);
  });

  it.each([
    ['an empty string', ''],
    ['whitespace only', '   '],
    ['a lone colon', ':']
  ])('returns an empty string for %s', (_label, value) => {
    expect(normalizeHostname(value)).toBe('');
  });

  it('never throws on unusable input', () => {
    expect(() => normalizeHostname('http://')).not.toThrow();
  });
});

describe('parseHostnameList', () => {
  it('parses several hostnames owned by one theme', () => {
    expect(parseHostnameList('app.soliguia.es,app.soliguia.cat')).toEqual([
      'app.soliguia.es',
      'app.soliguia.cat'
    ]);
  });

  it('tolerates whitespace, empty entries and a trailing comma', () => {
    expect(parseHostnameList(' app.soliguia.es , , app.soliguia.cat, ')).toEqual([
      'app.soliguia.es',
      'app.soliguia.cat'
    ]);
  });

  it('returns an empty list for an unset variable', () => {
    expect(parseHostnameList()).toEqual([]);
  });

  it('returns an empty list for an empty variable', () => {
    expect(parseHostnameList('')).toEqual([]);
  });
});

describe('matchThemeByHostname', () => {
  it.each([
    ['the exact hostname', 'app.soliguia.es'],
    ['an uppercase hostname', 'APP.SOLIGUIA.ES'],
    ['a hostname with a port', 'app.soliguia.es:8443'],
    ['a full origin', 'https://app.soliguia.es/'],
    ['the alias hostname', 'app.soliguia.cat']
  ])('resolves the Spanish theme from %s', (_label, hostname) => {
    expect(matchThemeByHostname(hostname, THEMES)?.name).toBe(Themes.SOLIGUIA_ES);
  });

  it('resolves the Andorran theme', () => {
    expect(matchThemeByHostname('app.soliguia.ad', THEMES)?.name).toBe(Themes.SOLIGUIA_AD);
  });

  it('ignores a www prefix', () => {
    const themesWithBareDomain = [buildTheme(Themes.SOLIGUIA_ES, ['soliguia.es'])];

    expect(matchThemeByHostname('www.soliguia.es', themesWithBareDomain)?.name).toBe(
      Themes.SOLIGUIA_ES
    );
  });

  it.each([
    ['an unmapped hostname', 'app-web-app.cleverapps.io'],
    ['an empty hostname', '']
  ])('returns null for %s', (_label, hostname) => {
    expect(matchThemeByHostname(hostname, THEMES)).toBeNull();
  });

  it('never matches a theme with no hostname configured', () => {
    const unconfiguredThemes = [buildTheme(Themes.SOLIGUIA_ES, [])];

    expect(matchThemeByHostname('app.soliguia.es', unconfiguredThemes)).toBeNull();
  });
});
