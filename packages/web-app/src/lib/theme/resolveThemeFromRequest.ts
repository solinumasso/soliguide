import { resolveTheme } from './resolveTheme';
import type { ThemeDefinition } from './types';

/**
 * Header priority for determining the public hostname.
 *
 * `x-forwarded-host` is set by the Clever Cloud / Qovery edge, and is the header
 * the Angular frontend's Caddy configuration already keys its theme on. `host`
 * covers a direct `node build` and any proxy that preserves the Host header.
 */
const HOSTNAME_HEADER_PRIORITY = ['x-forwarded-host', 'host'] as const;

/**
 * The hostname the visitor typed.
 *
 * Read from the request headers rather than from `url.origin`, because
 * adapter-node pins `url.origin` to the `ORIGIN` environment variable when it is
 * set, which would silently collapse every domain onto a single theme.
 */
export const getRequestHostname = (headers: Headers, requestUrl: URL): string => {
  const forwardedHostname = HOSTNAME_HEADER_PRIORITY.map((headerName) =>
    headers.get(headerName)
  ).find(Boolean);

  // A forwarding chain is comma-separated, the first entry being client-most
  return forwardedHostname ? forwardedHostname.split(',')[0] : requestUrl.hostname;
};

/** Resolves the theme of an incoming request, or `null` when its host is unmapped. */
export const resolveThemeFromRequest = (
  headers: Headers,
  requestUrl: URL
): ThemeDefinition | null => resolveTheme(getRequestHostname(headers, requestUrl));
