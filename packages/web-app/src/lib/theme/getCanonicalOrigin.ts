import type { ThemeDefinition } from './types';

/**
 * The origin the API should see for a theme.
 *
 * The API infers the country of a request from its `Origin` header
 * (`getThemeFromOrigin`), and only knows one origin per theme. Sending the
 * theme's first configured hostname therefore keeps alias hostnames working:
 * a visitor on a staging or demo hostname still gets Spanish taxonomy and language.
 *
 * The scheme is irrelevant to the API, which compares hostnames only, so `https`
 * is used unconditionally.
 */
export const getCanonicalOrigin = (theme: ThemeDefinition, fallbackOrigin: string): string => {
  const [canonicalHostname] = theme.hostnames;

  return canonicalHostname ? `https://${canonicalHostname}` : fallbackOrigin;
};
