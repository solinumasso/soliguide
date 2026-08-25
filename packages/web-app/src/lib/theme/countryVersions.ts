import type { SoliguideCountries, Themes } from '@soliguide/common';

import type { ThemeDefinition } from './types';

/** Another country's application, as offered to the visitor. */
export interface CountryVersion {
  theme: Themes;
  country: SoliguideCountries;
  brandName: string;
  /** Translation key of the country name, see `COUNTRY_NAME_*` in the catalogs. */
  nameKey: string;
  /** Hostname the country is served on, without a scheme. */
  hostname: string;
}

/**
 * Translation key holding a country's name in the language of the interface.
 *
 * Derived from the ISO code so that opening a country only means adding the key
 * to the catalogs: `es` -> `COUNTRY_NAME_ES`.
 */
export const getCountryNameKey = (country: SoliguideCountries): string =>
  `COUNTRY_NAME_${country.toUpperCase()}`;

/**
 * The countries a visitor can switch to, the one they are already on excluded.
 *
 * A theme with no configured hostname is left out: it is unreachable, so
 * offering it would only lead to a dead link. Ordered like `THEME_BLUEPRINTS`,
 * which is the order countries opened in.
 */
export const buildCountryVersions = (
  currentTheme: ThemeDefinition,
  themes: ThemeDefinition[]
): CountryVersion[] =>
  themes
    .filter((theme) => theme.name !== currentTheme.name && theme.hostnames.length > 0)
    .map((theme) => ({
      theme: theme.name,
      country: theme.country,
      brandName: theme.brandName,
      nameKey: getCountryNameKey(theme.country),
      hostname: theme.hostnames[0]
    }));

/**
 * Absolute URL of a country's home page, on the scheme and the port the visitor
 * is already browsing on.
 *
 * `getCanonicalOrigin` cannot be reused here: it hardcodes `https` and drops the
 * port, which is harmless for the `Origin` header the API only compares
 * hostnames of, but would make this URL unreachable on a dev server.
 *
 * The home page is targeted rather than the current path, because paths carry
 * place and category identifiers that are specific to one country.
 */
export const buildCountryVersionUrl = (countryVersion: CountryVersion, currentUrl: URL): string => {
  const targetUrl = new URL('/', currentUrl);
  // eslint-disable-next-line fp/no-mutation
  targetUrl.hostname = countryVersion.hostname;

  return targetUrl.toString();
};
