import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { browserTracingIntegration, init } from "@sentry/angular";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.sentryDsn) {
  init({
    dsn: environment.sentryDsn,
    environment: environment.environment,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
    integrations: [browserTracingIntegration()],
  });
}

if (environment.environment !== "DEV") {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error("fail to initialize AppModule", err));
