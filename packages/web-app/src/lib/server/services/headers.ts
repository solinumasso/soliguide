import type { RequestEvent } from '@sveltejs/kit';
import type { RequestOptions } from './types';

/**
 * Get headers from a request event
 */
export const getHeaders = (requestEvent: RequestEvent): RequestOptions => {
  const { headers } = requestEvent.request;

  return {
    origin: headers.get('origin') as string,
    referer: headers.get('referer') as string,
    'X-Ph-User-Session-Id': headers.get('X-Ph-User-Session-Id') as string,
    'X-Ph-User-Distinct-Id': headers.get('X-Ph-User-Distinct-Id') as string
  };
};
