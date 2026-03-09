import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testDir: 'web-tests',
  testMatch: /(?<a>.+\.)?(?<b>spec)\.ts/u
};

export default config;
