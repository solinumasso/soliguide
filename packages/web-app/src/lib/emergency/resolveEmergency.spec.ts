import { describe, expect, it } from 'vitest';
import { Categories, CountryCodes } from '@soliguide/common';

import { getActiveEmergency } from './resolveEmergency';
import type { EmergencyDefinition } from './types';

const buildEmergency = (overrides: Partial<EmergencyDefinition> = {}): EmergencyDefinition => ({
  id: 'test-emergency',
  active: true,
  countries: [CountryCodes.FR],
  highlight: {
    titleKey: 'TITLE',
    descriptionKey: 'DESCRIPTION',
    iconUrl: '/icon.png',
    quickSearches: [{ category: Categories.FOOD }]
  },
  ...overrides
});

describe('Active emergency resolution', () => {
  it('returns the emergency of a country running one', () => {
    const emergency = buildEmergency();

    expect(getActiveEmergency(CountryCodes.FR, [emergency])).toBe(emergency);
  });

  it('returns nothing when the emergency is switched off', () => {
    expect(getActiveEmergency(CountryCodes.FR, [buildEmergency({ active: false })])).toBeNull();
  });

  it('returns nothing for a country the emergency does not target', () => {
    expect(getActiveEmergency(CountryCodes.ES, [buildEmergency()])).toBeNull();
  });

  it('returns nothing when no emergency is declared at all', () => {
    expect(getActiveEmergency(CountryCodes.FR, [])).toBeNull();
  });

  it('serves the same emergency to every country it targets', () => {
    const emergency = buildEmergency({ countries: [CountryCodes.FR, CountryCodes.ES] });

    expect(getActiveEmergency(CountryCodes.FR, [emergency])).toBe(emergency);
    expect(getActiveEmergency(CountryCodes.ES, [emergency])).toBe(emergency);
  });

  it('skips an inactive emergency and keeps looking', () => {
    const active = buildEmergency({ id: 'active-one' });
    const emergencies = [buildEmergency({ id: 'retired-one', active: false }), active];

    expect(getActiveEmergency(CountryCodes.FR, emergencies)).toBe(active);
  });
});
