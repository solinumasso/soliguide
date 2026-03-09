import { HttpModule } from "@nestjs/axios";
import { Logger, Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
