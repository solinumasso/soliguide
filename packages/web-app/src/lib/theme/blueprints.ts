import { CountryCodes, SupportedLanguagesCode, Themes } from '@soliguide/common';

import type { ThemeBlueprint } from './types';

const SOLINUM_SITE = 'https://www.solinum.org/';
const SOLIDIGITAL_SITE = 'https://solidigital.org/';

/**
 * The whole per-country surface of the application.
 *
 * Opening a new country means adding one entry here, one entry to the shared
 * tables in `@soliguide/common`, one asset directory and one environment
 * variable. Nothing else in the code base needs to change.
 */
export const THEME_BLUEPRINTS: Record<Themes, ThemeBlueprint> = {
  [Themes.SOLIGUIDE_FR]: {
    name: Themes.SOLIGUIDE_FR,
    country: CountryCodes.FR,
    defaultLanguage: SupportedLanguagesCode.FR,
    organization: { name: 'Solinum', url: SOLINUM_SITE },
    capabilities: {
      practicalFiles: true,
      cookieManagement: true,
      becomeTranslator: true,
      // Chat temporarily hidden until September 2026
      chat: false,
      thermalComfort: true
    },
    practicalFilesUrl: 'https://support.soliguide.fr/hc/fr',
    becomeTranslatorUrl: 'https://airtable.com/shrZHYio1ZdnPl1Et',
    chatWebsiteId: null
  },
  [Themes.SOLIGUIA_ES]: {
    name: Themes.SOLIGUIA_ES,
    country: CountryCodes.ES,
    defaultLanguage: SupportedLanguagesCode.CA,
    organization: { name: 'Solidigital', url: SOLIDIGITAL_SITE },
    capabilities: {
      practicalFiles: false,
      cookieManagement: false,
      becomeTranslator: false,
      chat: false,
      thermalComfort: false
    },
    practicalFilesUrl: null,
    becomeTranslatorUrl: null,
    chatWebsiteId: null
  },
  [Themes.SOLIGUIA_AD]: {
    name: Themes.SOLIGUIA_AD,
    country: CountryCodes.AD,
    defaultLanguage: SupportedLanguagesCode.CA,
    organization: { name: 'Solidigital', url: SOLIDIGITAL_SITE },
    capabilities: {
      practicalFiles: false,
      cookieManagement: false,
      becomeTranslator: false,
      chat: false,
      thermalComfort: false
    },
    practicalFilesUrl: null,
    becomeTranslatorUrl: null,
    chatWebsiteId: null
  }
};

/** The theme served when a hostname is not mapped to any country. */
export const DEFAULT_THEME_NAME = Themes.SOLIGUIDE_FR;
