import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { CONFIG } from "./_models";

if (CONFIG.SENTRY_DSN?.length) {
  const isCron = CONFIG.CRON_ENABLED;

  Sentry.init({
    dsn: CONFIG.SENTRY_DSN,
    environment: CONFIG.ENV,

    integrations: [
      Sentry.mongoIntegration(),
      Sentry.mongooseIntegration(),
      nodeProfilingIntegration(),

      ...(!isCron
        ? [
            Sentry.httpIntegration(),
            Sentry.expressIntegration(),
            Sentry.nativeNodeFetchIntegration(),
          ]
        : []),
    ],

    tracesSampleRate: 1.0,
    profileSessionSampleRate: 1.0,
    profileLifecycle: "trace",
    attachStacktrace: true,
    enableLogs: true,
  });

  Sentry.logger.info(`[${isCron ? "CRON" : "API"}] [${CONFIG.ENV}] Restart`, {
    timestamp: new Date().toISOString(),
    cron: isCron,
  });
}
