import { isSummerSeason } from '@soliguide/common';

import type { ThemeDefinition } from './types';

/**
 * Whether the seasonal heatwave content belongs on screen: the emergency
 * shortcuts of the home page and the air conditioning tags of a place.
 *
 * Two conditions, deliberately kept apart: the country has to run the heatwave
 * campaign (`capabilities.thermalComfort`) and it has to be the season for it.
 * The air conditioning filter is not seasonal, so it only reads the capability.
 */
export const isSeasonalThermalComfortVisible = (
  theme: ThemeDefinition,
  now: Date = new Date()
): boolean => theme.capabilities.thermalComfort && isSummerSeason(now);
