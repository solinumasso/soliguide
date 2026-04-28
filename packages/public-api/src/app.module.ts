import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { SearchModule } from "./search/search.module";
import { versionDefinitions } from "./versions/version-definitions";
import { VersioningModule } from "./versioning-engine";
import { V20260426_CONTEXT_PROVIDER } from "./versions/2026-04-26/runtime/context";
import { V20260426MongoContextProvider } from "./versions/2026-04-26/runtime/mongo-context.adapter";
import { ApiVersionInterceptor } from "./api-version.interceptor";

@Module({
  imports: [VersioningModule.forRoot(versionDefinitions), SearchModule],
  providers: [
    {
      provide: V20260426_CONTEXT_PROVIDER,
      useClass: V20260426MongoContextProvider,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiVersionInterceptor,
    },
  ],
})
export class AppModule {}
