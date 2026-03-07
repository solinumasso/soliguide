import { env } from '$env/dynamic/public';

import {
  SUPPORTED_LANGUAGES,
  CountryCodes,
  SupportedLanguagesCode,
  Themes
} from '@soliguide/common';
import { readonly, writable, type Readable } from 'svelte/store';
import type { ThemeDefinition } from './types';

const themesConfig = [
  { theme: Themes.SOLIGUIDE_FR, hostname: env.PUBLIC_SOLIGUIDE_FR_DOMAIN_NAME },
  { theme: Themes.SOLIGUIA_ES, hostname: env.PUBLIC_SOLIGUIDE_ES_DOMAIN_NAME },
  { theme: Themes.SOLIGUIA_AD, hostname: env.PUBLIC_SOLIGUIDE_AD_DOMAIN_NAME }
];

const defaultTheme: ThemeDefinition = {
  name: Themes.SOLIGUIDE_FR,
  brandName: 'Soliguide',
  country: CountryCodes.FR,
  defaultLanguage: SupportedLanguagesCode.FR,
  supportedLanguages: SUPPORTED_LANGUAGES,
  media: {
    homeIllustration: 'soliguide_illustration_home.svg',
    favoritesIllustration: 'soliguide_illustration_favorites.svg',
    logos: {
      inline: 'soliguide-inline.svg',
      original: 'soliguide.svg',
      symbol: 'soliguide-symbol.svg'
    }
  },
  links: {
    fichesPratiques: 'https://support.soliguide.fr/hc/fr',
    solinumSite: 'https://www.solinum.org/',
    becomeTranslator: 'https://airtable.com/shrZHYio1ZdnPl1Et',
    cookiePolicy: 'https://soliguide.fr/fr/politique-cookies',
    privacyPolicy: 'https://soliguide.fr/fr/politique-confidentialite',
    dataProtectionAgreement: 'https://soliguide.fr/fr/accord-protection-donnees',
    legalNotice: 'https://soliguide.fr/fr/mentions-legales',
    termsAndConditions: 'https://soliguide.fr/fr/cgu'
  },
  chatWebsiteId: env.PUBLIC_CHAT_WEBSITE_ID
};

const themeDefinitions: Partial<ThemeDefinition>[] = [
  defaultTheme,
  {
    name: Themes.SOLIGUIA_ES,
    brandName: 'Soliguia',
    country: CountryCodes.ES,
    defaultLanguage: SupportedLanguagesCode.CA,
    chatWebsiteId: null
  },
  {
    name: Themes.SOLIGUIA_AD,
    brandName: 'Soliguia',
    country: CountryCodes.AD,
    defaultLanguage: SupportedLanguagesCode.CA,
    chatWebsiteId: null
  }
];

/**
 * Resolve theme from current host origin
 */
const resolveTheme = (hostname: string): ThemeDefinition | null => {
  const configTheme = themesConfig.find((item) => item.hostname === hostname)?.theme;

  if (!configTheme) {
    console.warn('No theme found for hostname', hostname);
    return null;
  }
  const theme = themeDefinitions.find((themeItem) => themeItem.name === configTheme);

  // Allows the theme to be partially defined
  return { ...defaultTheme, ...theme };
};

const getThemeStore = () => {
  const themeStore = writable({ ...defaultTheme });
  /**
   * Resolve theme from current host origin
   */
  const init = (hostname: string) => {
    const theme = resolveTheme(hostname);
    if (!theme) return;

    themeStore.update((oldTheme) => ({ oldTheme, ...theme }));
  };

  const getTheme = (): Readable<ThemeDefinition> => {
    return readonly(themeStore);
  };

  return {
    init,
    getTheme
  };
};

export { resolveTheme, getThemeStore };
