import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  Optional,
  SkipSelf,
} from "@angular/core";
import { createErrorHandler, TraceService } from "@sentry/angular";
import { PosthogModule } from "@soliguide/common-angular";
import { environment } from "../../../environments/environment";
import { PosthogInitService } from "./services/posthog-init.service";
import { SentryService } from "./services/sentry.service";
import { POSTHOG_PREFIX } from "./injectors/posthog-prefix.injector";

@NgModule({
  imports: [
    PosthogModule.forRoot({
      posthogUrl: environment.posthogUrl,
      posthogApiKey: environment.posthogApiKey,
      posthogLibraryName: "soliguide_frontend",
      soliguideApiUrl: environment.apiUrl,
      posthogDebug: environment.environment === "DEV",
    }),
  ],
  providers: [
    PosthogInitService,
    SentryService,
    {
      provide: ErrorHandler,
      useValue: createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [TraceService],
      multi: true,
    },
    { provide: POSTHOG_PREFIX, useValue: "" },
  ],
  exports: [PosthogModule],
})
export class AnalyticsModule {
  constructor(
    sentryService: SentryService,
    posthogInitService: PosthogInitService,
    @Optional() @SkipSelf() parentModule?: AnalyticsModule
  ) {
    if (parentModule !== null) {
      throw new Error(
        "AnalyticsModule is already loaded. Import it in the AppModule only"
      );
    }
    sentryService.registerUserChange();
    posthogInitService.init();
  }
}
