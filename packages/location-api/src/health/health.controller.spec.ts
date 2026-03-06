import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";
import { CONFIG_VALIDATOR } from "../config";
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        HttpModule,
        TerminusModule,
        RedisHealthModule,
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);

    controller["redis"] = {
      ping: jest.fn().mockResolvedValue("PONG"),
      status: "ready",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return something", async () => {
    expect(controller).toBeDefined();
    const response = await controller.check();
    expect(response).toBeDefined();
    expect(response.status).toBeDefined();
  });
});
