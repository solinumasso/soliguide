import type { HandleFetch } from '@sveltejs/kit';
import { getCanonicalOrigin } from '$lib/theme';

/**
 * Add headers to each request
 *
 * The origin is the theme's canonical one rather than the incoming one, because
 * the API derives the country of a request from this header and only knows one
 * origin per theme.
 */
export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
  const origin = getCanonicalOrigin(event.locals.theme, event.url.origin);

  request.headers.append('Content-Type', 'application/json');
  request.headers.append('Origin', origin);
  request.headers.append('Referer', `${origin}${event.url.pathname}${event.url.search}`);
  return fetch(request);
};
