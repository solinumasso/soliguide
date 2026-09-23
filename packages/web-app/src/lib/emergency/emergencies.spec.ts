import { describe, expect, it } from 'vitest';
import { CountryCodes, type SoliguideCountries } from '@soliguide/common';

import { EMERGENCIES } from './emergencies';

/** Every country the application serves. */
const ALL_COUNTRIES: SoliguideCountries[] = [CountryCodes.FR, CountryCodes.ES, CountryCodes.AD];

describe('Declared emergencies', () => {
  it.each(ALL_COUNTRIES)('declares at most one active emergency for %s', (country) => {
    const activeForCountry = EMERGENCIES.filter(
      ({ active, countries }) => active && countries.includes(country)
    );

    expect(activeForCountry.length).toBeLessThanOrEqual(1);
  });

  it('gives every emergency a unique identifier', () => {
    const identifiers = EMERGENCIES.map(({ id }) => id);

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });

  it('gives every emergency at least one surface to show', () => {
    EMERGENCIES.forEach(({ id, highlight, filter, tag }) => {
      expect({ id, hasSurface: Boolean(highlight ?? filter ?? tag) }).toEqual({
        id,
        hasSurface: true
      });
    });
  });

  it('gives every highlight at least one quick search', () => {
    EMERGENCIES.forEach(({ id, highlight }) => {
      if (highlight) {
        expect({ id, quickSearches: highlight.quickSearches.length > 0 }).toEqual({
          id,
          quickSearches: true
        });
      }
    });
  });

  /**
   * The filter names of a quick search are plain strings, so this replaces the
   * literal typing a single hardcoded filter list used to provide.
   */
  it('only pre-applies filters the same emergency declares', () => {
    EMERGENCIES.forEach(({ id, highlight, filter }) => {
      const referenced = (highlight?.quickSearches ?? []).flatMap(
        (quickSearch) => quickSearch.filters ?? []
      );
      const declared = filter ? [filter.name] : [];

      expect({ id, unknown: referenced.filter((name) => !declared.includes(name)) }).toEqual({
        id,
        unknown: []
      });
    });
  });
});
