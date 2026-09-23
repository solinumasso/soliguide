import type { SoliguideCountries } from '@soliguide/common';

import { EMERGENCIES } from './emergencies';
import type { EmergencyDefinition } from './types';

/**
 * The emergency a country is currently running, if any.
 *
 * `emergencies` is injectable so that the tests never depend on what is actually
 * declared, the way `now: Date = new Date()` is injected in the theme predicates.
 */
export const getActiveEmergency = (
  country: SoliguideCountries,
  emergencies: EmergencyDefinition[] = EMERGENCIES
): EmergencyDefinition | null =>
  emergencies.find(({ active, countries }) => active && countries.includes(country)) ?? null;
