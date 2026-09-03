import { describe, expect, it, vi } from 'vitest';

import { getRequestHostname } from './resolveThemeFromRequest';

vi.mock('$env/dynamic/public', () => ({ env: {} }));

const buildHeaders = (headers: Record<string, string>) => new Headers(headers);

describe('getRequestHostname', () => {
  const requestUrl = new URL('https://internal-hostname.example/languages');

  it('prefers the hostname forwarded by the edge', () => {
    const headers = buildHeaders({
      'x-forwarded-host': 'app.soliguia.es',
      host: 'internal-hostname.example'
    });

    expect(getRequestHostname(headers, requestUrl)).toBe('app.soliguia.es');
  });

  it('takes the client-most entry of a forwarding chain', () => {
    const headers = buildHeaders({
      'x-forwarded-host': 'app.soliguia.es, internal-proxy.example'
    });

    expect(getRequestHostname(headers, requestUrl)).toBe('app.soliguia.es');
  });

  it('uses the Host header when nothing is forwarded', () => {
    const headers = buildHeaders({ host: 'app.soliguia.ad' });

    expect(getRequestHostname(headers, requestUrl)).toBe('app.soliguia.ad');
  });

  it('falls back to the request URL when no header carries a hostname', () => {
    expect(getRequestHostname(buildHeaders({}), requestUrl)).toBe('internal-hostname.example');
  });
});
