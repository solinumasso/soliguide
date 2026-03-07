import { Module } from "@nestjs/common";
import { PublicHolidaysService } from "./services/public-holidays.service";
import { HolidaysController } from "./controllers/holidays/holidays.controller";
import { HttpModule } from "@nestjs/axios";
import { CacheManagerService } from "../cache-manager/services/cache-manager.service";
import { GenerateHolidaysService } from "./services/generate-holidays.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  controllers: [HolidaysController],
  providers: [
    PublicHolidaysService,
    GenerateHolidaysService,
    CacheManagerService,
  ],
  imports: [HttpModule, ScheduleModule.forRoot()],
})
export class HolidaysModule {}
