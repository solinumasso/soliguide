import { HttpModule } from "@nestjs/axios";
import { Logger, Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";

@Module({
  imports: [
    RedisHealthModule,
    TerminusModule.forRoot({
      logger: Logger,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
