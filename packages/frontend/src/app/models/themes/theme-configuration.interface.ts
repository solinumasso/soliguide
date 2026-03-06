import type {
  SupportedLanguagesCode,
  SoliguideCountries,
} from "@soliguide/common";

export enum PrivateDashboards {
  TerritorialAnalysis = "territorialAnalysis",
  SeasonalAnalysis = "seasonalAnalysis",
  FoodAccess = "foodAccess",
  OlympicGames = "olympicGames",
  AnticipateClosures = "anticipateClosures",
}

export enum PublicDashboards {
  SearchTracking = "searchTracking",
  DemoFoodAccess = "demoFoodAccess",
}

type Dashboards = PrivateDashboards | PublicDashboards;

export interface SolidataDashboardConfig {
  label: string;
  dashboardUrl: string;
  seoUrl: string;
}

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
  solidata?: {
    [key in Dashboards]: SolidataDashboardConfig;
  };
  praticalFilesLink?: string;
  becomeTranslatorFormLink?: string;
  donateLink?: string;
  proAccountCreationFormLink?: string;
  chatWebsiteId?: string;
  territoriesStats?: {
    territoriesPresent: number;
  };
  showTranslationMenuDropdown?: boolean;
  showSoligareMenu?: boolean;
  websiteUrl?: string;
}
