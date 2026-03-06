import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { ReverseController } from "./reverse.controller";
import { FrenchAddressService } from "../../services/french-address.service";
import { CONFIG_VALIDATOR } from "../../../config";
import { DepartmentsAndRegionsService } from "../../services/departments-regions.service";
import { HereApiService } from "../../services/here-api/here-api.service";
import { CacheManagerModule } from "../../../cache-manager";

describe("ReverseController", () => {
  let controller: ReverseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReverseController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        HttpModule,
        CacheManagerModule,
      ],
      providers: [
        FrenchAddressService,
        HereApiService,
        DepartmentsAndRegionsService,
      ],
    }).compile();

    controller = module.get<ReverseController>(ReverseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
