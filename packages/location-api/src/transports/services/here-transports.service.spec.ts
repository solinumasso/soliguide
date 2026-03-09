import { Test, TestingModule } from "@nestjs/testing";
import { HereTransportsService } from "./here-transports.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { CONFIG_VALIDATOR } from "../../config";

describe("HereTransportsService", () => {
  let service: HereTransportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HereTransportsService],
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
      ],
    }).compile();

    service = module.get<HereTransportsService>(HereTransportsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
