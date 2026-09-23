import { getContext, setContext } from 'svelte';

import type { EmergencyDefinition } from './types';

const EMERGENCY_CTX_KEY = Symbol('emergencyContext');

/**
 * The emergency is resolved from the theme's country, which is itself resolved
 * per request from the hostname, so it cannot change while a page is alive. A
 * plain immutable value is therefore enough — no store, like the theme itself.
 */
export const setEmergencyContext = (emergency: EmergencyDefinition | null): void => {
  setContext(EMERGENCY_CTX_KEY, emergency);
};

export const getEmergencyContext = (): EmergencyDefinition | null => getContext(EMERGENCY_CTX_KEY);
