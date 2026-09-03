import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { isRightToLeftLanguage } from '@soliguide/common';

import {
  getDefaultTheme,
  getRequestHostname,
  getRequestLanguage,
  resolveThemeFromRequest
} from '$lib/theme';

Sentry.init({
  dsn: env.PRIVATE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: true,
  sampleRate: 1.0,
  sendDefaultPii: true
});

/**
 * Resolves the country context of every request from its public hostname, and
 * fills in the theme dependent parts of the document shell.
 *
 * A single deployment serves every country, so the theme has to be per request:
 * any module level state would leak between concurrent requests.
 */
const themeHandle: Handle = ({ event, resolve }) => {
  const resolvedTheme = resolveThemeFromRequest(event.request.headers, event.url);

  if (!resolvedTheme) {
    // Never fail on branding alone: preview hostnames (*.cleverapps.io,
    // *.qovery.io) are not mapped and must still serve a usable application.
    console.warn(
      'No theme found for hostname',
      getRequestHostname(event.request.headers, event.url)
    );
  }

  const theme = resolvedTheme ?? getDefaultTheme();
  // eslint-disable-next-line fp/no-mutation
  event.locals.theme = theme;

  const language = getRequestLanguage(event.url.pathname, theme);

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace('%theme.lang%', language)
        .replace('%theme.dir%', isRightToLeftLanguage(language) ? 'rtl' : 'ltr')
  });
};

/**
 * The document is the one response that must never be reused without asking.
 *
 * It names the hashed asset files, so a stale document keeps an old version of
 * the application running. `no-cache` does not forbid storing it, it forces a
 * revalidation before every reuse, which the ETag makes cheap.
 *
 * Assets are deliberately left alone: their name changes with their content, so
 * caching them is both safe and worth it on a poor connection.
 */
const documentCacheHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  if (response.headers.get('content-type')?.startsWith('text/html')) {
    response.headers.set('cache-control', 'no-cache');
  }

  return response;
};

export const handle = sequence(sentryHandle(), themeHandle, documentCacheHandle);

export const handleError = handleErrorWithSentry();
