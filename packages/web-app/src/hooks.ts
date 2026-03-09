import type { HandleFetch } from '@sveltejs/kit';

/**
 * Add headers to each request
 */
export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
  request.headers.append('Content-Type', 'application/json');
  request.headers.append('Origin', event.url.origin);
  request.headers.append('Referer', event.url.href);
  return fetch(request);
};
