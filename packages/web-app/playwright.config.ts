import type { PlaywrightTestConfig } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Countries are resolved from the public hostname, so the tests run the real
 * adapter-node server and drive the theme through `X-Forwarded-Host`. This
 * exercises the exact header path used on Clever Cloud, and needs no DNS or
 * `/etc/hosts` entry.
 */
const THEME_HOSTNAMES = {
  'soliguide-fr': 'app.soliguide.fr',
  'soliguia-es': 'app.soliguia.es',
  'soliguia-ad': 'app.soliguia.ad'
};

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && node build',
    port: PORT,
    env: {
      PORT: String(PORT),
      HOST_HEADER: 'x-forwarded-host',
      PROTOCOL_HEADER: 'x-forwarded-proto',
      PUBLIC_SOLIGUIDE_FR_HOSTNAMES: THEME_HOSTNAMES['soliguide-fr'],
      PUBLIC_SOLIGUIA_ES_HOSTNAMES: `${THEME_HOSTNAMES['soliguia-es']},app.soliguia.cat`,
      PUBLIC_SOLIGUIA_AD_HOSTNAMES: THEME_HOSTNAMES['soliguia-ad']
    }
  },
  testDir: 'web-tests',
  testMatch: /(?<a>.+\.)?(?<b>spec)\.ts/u,
  projects: Object.entries(THEME_HOSTNAMES).map(([name, hostname]) => ({
    name,
    use: {
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'x-forwarded-host': hostname,
        'x-forwarded-proto': 'http'
      }
    }
  }))
};

export default config;
