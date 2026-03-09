import { NgModule, Optional, SkipSelf } from "@angular/core";
import { PosthogModule } from "@soliguide/common-angular";

import { environment } from "../../../environments/environment";

@NgModule({
  imports: [
    PosthogModule.forRoot({
      posthogUrl: environment.posthogUrl,
      posthogApiKey: environment.posthogApiKey,
      posthogLibraryName: "soliguide_widget",
      soliguideApiUrl: environment.apiUrl,
      posthogDebug: environment.environment === "DEV",
    }),
  ],
  exports: [PosthogModule],
})
export class AnalyticsModule {
  constructor(@Optional() @SkipSelf() parentModule?: AnalyticsModule) {
    if (parentModule !== null) {
      throw new Error(
        "AnalyticsModule is already loaded. Import it in the AppModule only"
      );
    }
  }
}
