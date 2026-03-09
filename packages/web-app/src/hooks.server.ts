import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/private';

Sentry.init({
  dsn: env.PRIVATE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: true,
  sampleRate: 1.0,
  sendDefaultPii: true
});

export const handle = sentryHandle();

export const handleError = handleErrorWithSentry();
