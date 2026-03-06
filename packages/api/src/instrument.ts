import { CONFIG } from "./_models";
import {
  captureMessage,
  expressIntegration,
  httpIntegration,
  init,
  mongoIntegration,
  mongooseIntegration,
  nativeNodeFetchIntegration,
} from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

if (CONFIG.SENTRY_DSN?.length) {
  init({
    dsn: CONFIG.SENTRY_DSN,
    environment: CONFIG.ENV,
    integrations: [
      httpIntegration(),
      mongoIntegration(),
      nativeNodeFetchIntegration(),
      expressIntegration(),
      mongooseIntegration(),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    attachStacktrace: true,
  });

  captureMessage(
    `[INFO] ${CONFIG.CRON_ENABLED ? "[CRON]" : "[API]"} [${
      CONFIG.ENV
    }] API Restart - ${new Date()}`
  );
}
