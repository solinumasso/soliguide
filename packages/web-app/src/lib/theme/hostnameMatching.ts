import type { ThemeDefinition } from './types';

const SCHEME_PATTERN = /^https?:\/\//u;
const WWW_PREFIX_PATTERN = /^www\./u;
const TRAILING_DOT_PATTERN = /\.$/u;
const HOSTNAME_SEPARATOR = ',';

/**
 * Reduces any host-ish string to a bare, comparable hostname: drops the scheme,
 * the port, a trailing dot and a `www.` prefix, and lowercases the result.
 *
 * Accepts everything the deployment chain can hand us, from a configured
 * `https://App.Soliguia.ES/` to a raw `app.soliguia.es:8443` Host header.
 * Returns an empty string rather than throwing on unusable input.
 */
export const normalizeHostname = (value: string): string => {
  const trimmedValue = value.trim().toLowerCase();

  if (!trimmedValue) {
    return '';
  }

  try {
    const withScheme = SCHEME_PATTERN.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;

    return new URL(withScheme).hostname
      .replace(TRAILING_DOT_PATTERN, '')
      .replace(WWW_PREFIX_PATTERN, '');
  } catch {
    return '';
  }
};

/**
 * Parses the comma-separated hostname list of a theme, as configured in the
 * environment: a theme can be served on several hostnames, a production one
 * and a staging one for instance.
 */
export const parseHostnameList = (rawValue?: string): string[] =>
  (rawValue ?? '').split(HOSTNAME_SEPARATOR).map(normalizeHostname).filter(Boolean);

/** Finds the theme serving a hostname, or `null` when none claims it. */
export const matchThemeByHostname = (
  hostname: string,
  themes: ThemeDefinition[]
): ThemeDefinition | null => {
  const normalizedHostname = normalizeHostname(hostname);

  if (!normalizedHostname) {
    return null;
  }

  return themes.find((theme) => theme.hostnames.includes(normalizedHostname)) ?? null;
};
