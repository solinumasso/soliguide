import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { LocationModule } from "./location/location.module";
import { HealthModule } from "./health/health.module";
import { CONFIG_VALIDATOR } from "./config";
import { TransportsModule } from "./transports/transports.module";
import { HolidaysModule } from "./holidays/holidays.module";
import { SentryModule } from "@sentry/nestjs/setup";
import { CacheManagerModule } from "./cache-manager/cache-manager.module";
import { CacheManagerInterceptor } from "./cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";

@Module({
  imports: [
    LocationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: CONFIG_VALIDATOR,
    }),
    LoggerModule.forRoot(),
    SentryModule.forRoot(),
    HealthModule,
    TransportsModule,
    HolidaysModule,
    CacheManagerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheManagerInterceptor,
    },
  ],
})
export class AppModule {}
