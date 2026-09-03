import {
  BRAND_NAME_BY_THEME,
  getSupportedLanguagesByCountry,
  type Themes
} from '@soliguide/common';

import { parseHostnameList } from './hostnameMatching';
import type { ThemeBlueprint, ThemeDefinition, ThemeMedia } from './types';

const THEME_ASSETS_ROOT = '/images/themes';

/** Applies the fixed naming convention of `static/images/themes/<theme>/`. */
const buildThemeMedia = (assetsDirectory: string): ThemeMedia => {
  const assetPath = (fileName: string) => `${THEME_ASSETS_ROOT}/${assetsDirectory}/${fileName}`;

  return {
    assetsDirectory,
    logos: {
      original: assetPath('logo.svg'),
      inline: assetPath('logo-inline.svg'),
      symbol: assetPath('logo-symbol.svg')
    },
    illustrations: {
      home: assetPath('illustration-home.svg'),
      favorites: assetPath('illustration-favorites.svg'),
      languageSelection: assetPath('illustration-language-selection.svg')
    }
  };
};

/**
 * Name of the environment variable holding a theme's hostnames, derived from the
 * `Themes` enum value so that a new country needs no change here:
 *   soliguia_es -> PUBLIC_SOLIGUIA_ES_HOSTNAMES
 */
export const getHostnamesEnvKey = (theme: Themes): string =>
  `PUBLIC_${theme.toUpperCase()}_HOSTNAMES`;

/** Everything a blueprint does not declare is derived here. */
export const buildThemeDefinition = (
  blueprint: ThemeBlueprint,
  publicEnv: Record<string, string | undefined>
): ThemeDefinition => ({
  ...blueprint,
  brandName: BRAND_NAME_BY_THEME[blueprint.name],
  hostnames: parseHostnameList(publicEnv[getHostnamesEnvKey(blueprint.name)]),
  supportedLanguages: getSupportedLanguagesByCountry(blueprint.country),
  media: buildThemeMedia(blueprint.name),
  links: {
    practicalFiles: blueprint.capabilities.practicalFiles ? blueprint.practicalFilesUrl : null,
    becomeTranslator: blueprint.capabilities.becomeTranslator
      ? blueprint.becomeTranslatorUrl
      : null,
    organizationSite: blueprint.organization.url
  }
});
