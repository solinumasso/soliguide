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
import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
import { CacheManagerModule } from "../../../cache-manager";
import { BOROUGH_FR_MOCK, Example } from "../../mocks/BOROUGH_FR.mock";

describe("E2E - Location autocomplete endpoints", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        CacheManagerModule,
        LocationModule,
      ],
      providers: [ConfigService, CacheManagerService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  const cities = Object.keys(BOROUGH_FR_MOCK) as Array<
    keyof typeof BOROUGH_FR_MOCK
  >;
  for (const city of cities) {
    const boroughs = BOROUGH_FR_MOCK[city] as Record<string, Example>;
    describe(`Tests every borough of ${String(city)}`, () => {
      for (const [code, example] of Object.entries(boroughs)) {
        for (const inputValue of example.input) {
          it(`GET /autocomplete/FR/all/${inputValue} should return a label included in expectedOutput for ${code}`, async () => {
            const response = await app.inject({
              method: "GET",
              url: `/autocomplete/FR/all/${inputValue}`,
            });

            expect(response.statusCode).toEqual(200);
            const body = response.json();
            expect(body[0]).toBeDefined();
            const label = body[0].label;
            expect(example.expectedOutput).toContain(label);
          });
        }
      }
    });
  }

  it("/GET autocomplete: should return 404", async () =>
    await app
      .inject({
        method: "GET",
        url: "/autocomplete/FR",
      })
      .then(({ statusCode }) => {
        expect(statusCode).toEqual(404);
      }));
  afterAll(async () => await app.close());
});
