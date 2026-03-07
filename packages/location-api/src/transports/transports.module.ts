import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CacheManagerService } from "../cache-manager/services/cache-manager.service";
import { TransportsController } from "./controllers/transports.controller";
import { HereTransportsService } from "./services/here-transports.service";

@Module({
  controllers: [TransportsController],
  providers: [HereTransportsService, CacheManagerService],
  imports: [HttpModule],
})
export class TransportsModule {}
