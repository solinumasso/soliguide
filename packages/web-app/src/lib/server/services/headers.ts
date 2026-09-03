import type { RequestEvent } from '@sveltejs/kit';
import { getCanonicalOrigin } from '$lib/theme';
import type { RequestOptions } from './types';

/**
 * Get headers from a request event
 *
 * The origin is the theme's canonical one rather than the incoming one, because
 * the API derives the country of a request from this header and only knows one
 * origin per theme.
 */
export const getHeaders = (requestEvent: RequestEvent): RequestOptions => {
  const { headers } = requestEvent.request;
  const origin = getCanonicalOrigin(requestEvent.locals.theme, headers.get('origin') as string);

  return {
    origin,
    referer: headers.get('referer') as string,
    'X-Ph-User-Session-Id': headers.get('X-Ph-User-Session-Id') as string,
    'X-Ph-User-Distinct-Id': headers.get('X-Ph-User-Distinct-Id') as string
  };
};
