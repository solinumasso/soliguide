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
