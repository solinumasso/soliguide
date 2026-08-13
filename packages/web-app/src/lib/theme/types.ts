import type {
  LegalPage,
  SoliguideCountries,
  SupportedLanguagesCode,
  Themes
} from '@soliguide/common';

/**
 * Features that can be turned on or off per country.
 *
 * These are explicit booleans rather than "is this optional link set?" checks,
 * so that opening a new country is a deliberate decision for every feature
 * instead of the consequence of an omission.
 */
export interface ThemeCapabilities {
  /** Link to the help center holding the practical files. */
  practicalFiles: boolean;
  /** Cookie consent management dialog. */
  cookieManagement: boolean;
  /** Call for volunteer translators. */
  becomeTranslator: boolean;
  /** Live chat with the support team. */
  chat: boolean;
}

/** The organization operating a theme, shown in the settings screen. */
export interface ThemeOrganization {
  /** Interpolated into translations through the `organizationName` variable. */
  name: string;
  url: string;
}

/**
 * Everything a country has to declare. Holds no behaviour and nothing that can
 * be derived from another source: adding a country means adding one entry here.
 */
export interface ThemeBlueprint {
  name: Themes;
  country: SoliguideCountries;
  /**
   * The language the interface opens in. Explicitly declared rather than
   * derived from `SUPPORTED_LANGUAGES_BY_COUNTRY[country].source`, which is the
   * language content is authored in and is not necessarily the same thing.
   */
  defaultLanguage: SupportedLanguagesCode;
  organization: ThemeOrganization;
  capabilities: ThemeCapabilities;
  /** `null` when the corresponding capability is off. */
  practicalFilesUrl: string | null;
  becomeTranslatorUrl: string | null;
  chatWebsiteId: string | null;
}

/**
 * Ready to use paths of a theme's images.
 *
 * Built once from the theme's asset directory so that no component has to know
 * the naming convention. See `static/images/themes/README.md`.
 */
export interface ThemeMedia {
  /** Directory name under `static/images/themes/`, the `Themes` enum value. */
  assetsDirectory: string;
  logos: {
    original: string;
    inline: string;
    symbol: string;
  };
  illustrations: {
    home: string;
    favorites: string;
    languageSelection: string;
  };
}

/** Links that do not depend on the language currently selected. */
export interface ThemeLinks {
  practicalFiles: string | null;
  becomeTranslator: string | null;
  organizationSite: string;
}

/**
 * A resolved theme: a blueprint plus everything derived from `@soliguide/common`
 * and from the environment. This is what components consume.
 */
export interface ThemeDefinition extends ThemeBlueprint {
  brandName: string;
  /** Hostnames this theme is served on, normalized and without a scheme. */
  hostnames: string[];
  supportedLanguages: SupportedLanguagesCode[];
  media: ThemeMedia;
  links: ThemeLinks;
}

/**
 * Absolute URLs of the legal documents, rebuilt whenever the language changes
 * because each website publishes them under a localized path.
 */
export type ThemeLegalLinks = Record<LegalPage, string>;
