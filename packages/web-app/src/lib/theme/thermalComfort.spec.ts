import { describe, expect, it } from 'vitest';
import { Themes } from '@soliguide/common';

import { buildThemeDefinition } from './buildThemeDefinition';
import { THEME_BLUEPRINTS } from './blueprints';
import { isSeasonalThermalComfortVisible } from './thermalComfort';

const IN_SUMMER = new Date('2026-07-15T12:00:00Z');
const OUT_OF_SUMMER = new Date('2026-01-15T12:00:00Z');

const buildTheme = (theme: Themes) => buildThemeDefinition(THEME_BLUEPRINTS[theme], {});

describe('Seasonal thermal comfort visibility', () => {
  it('is visible in France during summer', () => {
    expect(isSeasonalThermalComfortVisible(buildTheme(Themes.SOLIGUIDE_FR), IN_SUMMER)).toBe(true);
  });

  it('is hidden in France outside summer', () => {
    expect(isSeasonalThermalComfortVisible(buildTheme(Themes.SOLIGUIDE_FR), OUT_OF_SUMMER)).toBe(
      false
    );
  });

  it.each([Themes.SOLIGUIA_ES, Themes.SOLIGUIA_AD])(
    'is hidden for %s even during summer',
    (theme) => {
      expect(isSeasonalThermalComfortVisible(buildTheme(theme), IN_SUMMER)).toBe(false);
    }
  );
});
