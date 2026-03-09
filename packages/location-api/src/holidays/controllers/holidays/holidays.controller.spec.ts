import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { HolidaysController } from "./holidays.controller";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { PublicHolidaysService } from "../../services/public-holidays.service";
import { GenerateHolidaysService } from "../../services/generate-holidays.service";
import { CacheManagerModule } from "../../../cache-manager";

describe("HolidaysController", () => {
  let controller: HolidaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        HttpModule,
        CacheManagerModule,
      ],
      providers: [
        CacheManagerService,
        { provide: CACHE_MANAGER, useValue: {} },
        PublicHolidaysService,
        GenerateHolidaysService,
      ],
    }).compile();

    controller = module.get<HolidaysController>(HolidaysController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
