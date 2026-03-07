import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from "@angular/core";
import { PosthogAddUserIdHeadersInterceptor } from "./posthog-add-user-id-headers.interceptor";
import { PosthogConfig } from "./posthog-config";
import { PosthogService } from "./posthog.service";

@NgModule({
  providers: [
    PosthogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PosthogAddUserIdHeadersInterceptor,
      multi: true,
    },
  ],
})
export class PosthogModule {
  static forRoot(config: PosthogConfig): ModuleWithProviders<PosthogModule> {
    return {
      ngModule: PosthogModule,
      providers: [{ provide: PosthogConfig, useValue: config }],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule?: PosthogModule) {
    if (parentModule) {
      throw new Error(
        "PosthogModule is already loaded. Import it in the AppModule only"
      );
    }
  }
}
