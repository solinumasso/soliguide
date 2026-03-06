import { Test, TestingModule } from "@nestjs/testing";
import { TransportsController } from "./transports.controller";
import { HereTransportsService } from "../services/here-transports.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_VALIDATOR } from "../../config";
import { CacheManagerService } from "../../cache-manager/services/cache-manager.service";
import { CacheManagerModule } from "../../cache-manager";

describe("TransportsController", () => {
  let controller: TransportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportsController],
      providers: [HereTransportsService, ConfigService, CacheManagerService],
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        CacheManagerModule,
      ],
    }).compile();

    controller = module.get<TransportsController>(TransportsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
