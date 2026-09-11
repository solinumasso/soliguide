import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';
import { captureNativeAppVersion } from '$lib/services/nativeBridgeService';

// Before the router runs: the mobile application advertises its version on the
// very first url only, and the first client side navigation drops it.
captureNativeAppVersion(window.location.href);

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
