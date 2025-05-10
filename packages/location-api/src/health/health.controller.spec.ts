/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
