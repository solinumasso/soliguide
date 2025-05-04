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
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { CountryCodes, GeoTypes } from "@soliguide/common";

import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerModule } from "../../../cache-manager";

describe("E2E - Reverse latitude & longitude to get an address", () => {
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
      providers: [ConfigService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  describe("📌 Geocoding /autocomplete/reverse/:latitude/:longitude", () => {
    it(`/GET Should return error when latitude is not a correct value`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/reverse/fr/xxxx/xxxx",
        })
        .then((response) => expect(response.statusCode).toEqual(400)));

    it(`/GET Should return 'Place Pey Berland' `, async () =>
      await app
        .inject({
          method: "GET",
          url: "/reverse/fr/44.837218/-0.577159",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            name: "31 Place Pey Berland",
            label: "31 Place Pey Berland, 33000 Bordeaux",
            geoValue: "31-place-pey-berland-33000-bordeaux",
            coordinates: [-0.577159, 44.83722],
            postalCode: "33000",
            cityCode: "33063",
            city: "Bordeaux",
            geoType: GeoTypes.POSITION,
            country: CountryCodes.FR,
            department: "Gironde",
            departmentCode: "33",
            region: "Nouvelle-Aquitaine",
            regionCode: "75",
            slugs: {
              city: "bordeaux",
              ville: "bordeaux",
              country: "fr",
              pays: "fr",
              departement: "gironde",
              department: "gironde",
              region: "nouvelle-aquitaine",
            },
            timeZone: "Europe/Paris",
          });
        }));
  });

  afterAll(async () => await app.close());
});
