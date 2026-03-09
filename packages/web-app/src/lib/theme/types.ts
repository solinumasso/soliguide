import type { SupportedLanguagesCode, SoliguideCountries, Themes } from '@soliguide/common';

export interface ThemeDefinition {
  name: Themes;
  brandName: string;
  country: SoliguideCountries;
  defaultLanguage: SupportedLanguagesCode;
  supportedLanguages: SupportedLanguagesCode[];
  media: {
    homeIllustration: string;
    favoritesIllustration: string;
    logos: {
      inline: string;
      original: string;
      symbol: string;
    };
  };
  links: {
    fichesPratiques: string;
    solinumSite: string;
    becomeTranslator: string;
    cookiePolicy: string;
    privacyPolicy: string;
    dataProtectionAgreement: string;
    legalNotice: string;
    termsAndConditions: string;
  };
  chatWebsiteId: string | undefined | null;
}
