import * as dotenv from 'dotenv';
import { join } from 'path';

import {
  fastifyIntegration,
  httpIntegration,
  init,
  nestIntegration,
} from '@sentry/nestjs';

function getEnvPath(): string {
  const isTypescript = __filename.endsWith('.ts'); // ts local / js prod
  const path = isTypescript ? '../../' : '../';
  const envPath = join(__dirname, path, '.env');

  console.log(
    'Environment detected:',
    isTypescript ? 'TypeScript' : 'JavaScript',
  );
  console.log('Loading .env from:', envPath);

  return envPath;
}

dotenv.config({ path: getEnvPath() });

if (process.env.LOCATION_API_SENTRY_DSN) {
  init({
    enabled: !!process.env.LOCATION_API_SENTRY_DSN,
    dsn: process.env.LOCATION_API_SENTRY_DSN,
    environment: process.env.ENV,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [httpIntegration(), fastifyIntegration(), nestIntegration()],
  });
}
