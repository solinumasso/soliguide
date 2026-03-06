import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';

Sentry.init({
  dsn: env.PUBLIC_SENTRY_DSN,
  environment: 'production',
  enabled: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.captureConsoleIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0,
  tracesSampler: () => true,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0
});

export const handleError = handleErrorWithSentry();
