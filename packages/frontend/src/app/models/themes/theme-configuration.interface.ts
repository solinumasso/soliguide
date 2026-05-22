import type {
  SupportedLanguagesCode,
  SoliguideCountries,
} from "@soliguide/common";

export interface ThemeConfiguration {
  brandName: string;
  logos: {
    inline: string;
    original: string;
    symbol: string;
    sponsor?: string;
  };
  country: SoliguideCountries;
  defaultCoordinates: readonly number[];
  defaultLanguage: SupportedLanguagesCode;
  suggestedLanguages: readonly SupportedLanguagesCode[];
  mobileApp?: {
    androidLink: string;
    appleLink: string;
  };
  helpEnabled: boolean;
  solinumHomeLink: string;
  aboutSolinumLink?: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  becomeVolunteerEnabled: boolean;
  contactFormEnabled: boolean;
  locationAutocompletePlaceholder: string;
  backofficeUrl?: string;
  praticalFilesLink?: string;
  becomeTranslatorFormLink?: string;
  donateLink?: string;
  proAccountCreationFormLink?: string;
  chatWebsiteId?: string;
  territoriesStats?: {
    territoriesPresent: number;
  };
  showTranslationMenuDropdown?: boolean;
  websiteUrl?: string;
}
