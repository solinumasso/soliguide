import { env } from '$env/dynamic/public';
import type { Themes } from '@soliguide/common';

import { DEFAULT_THEME_NAME, THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition, getHostnamesEnvKey } from './buildThemeDefinition';
import { matchThemeByHostname } from './hostnameMatching';
import type { ThemeDefinition } from './types';

/** Environment variables replaced by `getHostnamesEnvKey`, warned about once. */
const LEGACY_HOSTNAME_ENV_KEYS = [
  'PUBLIC_SOLIGUIDE_FR_DOMAIN_NAME',
  'PUBLIC_SOLIGUIDE_ES_DOMAIN_NAME',
  'PUBLIC_SOLIGUIDE_AD_DOMAIN_NAME'
];

/**
 * `$env/dynamic/public` is read once per process. Building the registry lazily
 * keeps the module importable from unit tests, which inject their own env.
 */
const buildThemeRegistry = (publicEnv: Record<string, string | undefined>): ThemeDefinition[] =>
  Object.values(THEME_BLUEPRINTS).map((blueprint) => buildThemeDefinition(blueprint, publicEnv));

const warnAboutLegacyEnvKeys = (publicEnv: Record<string, string | undefined>): void => {
  const legacyKeysInUse = LEGACY_HOSTNAME_ENV_KEYS.filter((key) => publicEnv[key]);

  if (legacyKeysInUse.length) {
    console.warn(
      `Ignoring legacy theme environment variables: ${legacyKeysInUse.join(', ')}. ` +
        `Use ${Object.keys(THEME_BLUEPRINTS)
          .map((theme) => getHostnamesEnvKey(theme as Themes))
          .join(', ')} instead.`
    );
  }
};

// eslint-disable-next-line fp/no-let
let themeRegistry: ThemeDefinition[] | null = null;

const getThemeRegistry = (): ThemeDefinition[] => {
  if (!themeRegistry) {
    warnAboutLegacyEnvKeys(env);
    // eslint-disable-next-line fp/no-mutation
    themeRegistry = buildThemeRegistry(env);
  }

  return themeRegistry;
};

/** Every configured theme, in the order countries opened in. */
export const getAllThemes = (): ThemeDefinition[] => getThemeRegistry();

/** The theme served when a hostname is not mapped to any country. */
export const getDefaultTheme = (): ThemeDefinition => {
  const defaultTheme = getThemeRegistry().find((theme) => theme.name === DEFAULT_THEME_NAME);

  if (!defaultTheme) {
    throw new Error(`No blueprint declared for the default theme ${DEFAULT_THEME_NAME}`);
  }

  return defaultTheme;
};

/** Resolves the theme serving a hostname, or `null` when none claims it. */
export const resolveTheme = (hostname: string): ThemeDefinition | null =>
  matchThemeByHostname(hostname, getThemeRegistry());

export { buildThemeRegistry };
