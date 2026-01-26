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
import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
import { GeoTypes, LocationAutoCompleteAddress } from "@soliguide/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { CacheManagerModule } from "../../../cache-manager";

describe("E2E - Location autocomplete endpoints for Spain", () => {
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
      providers: [
        ConfigService,
        CacheManagerService,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe("Autocomplete: search by geotype", () => {
    it(`/GET /autocomplete/FR/all/2%20boulevard%20de%20l%27europe%20poissy?geoType=chips - should throw an error`, async () => {
      const response = await app.inject({
        method: "GET",
        url: "/autocomplete/FR/all/2%20boulevard%20de%20l%27europe%20poissy?geoType=chips",
      });

      const body = JSON.parse(response.body);
      expect(body?.message).toEqual("GEOTYPE_NOT_VALID");
      expect(response.statusCode).toEqual(400);
    });

    it(`/autocomplete/FR/all/bourgogne?geoType=${GeoTypes.REGION}`, async () => {
      const response = await app.inject({
        method: "GET",
        url: `/autocomplete/FR/all/bourgogne?geoType=${GeoTypes.REGION}`,
      });

      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body[0]).toBeDefined();
      expect(body.length).toEqual(1);

      const location = body[0] as LocationAutoCompleteAddress;
      expect(location.region).toBeDefined();
      expect(location.region).toEqual("Bourgogne-Franche-Comté");
      expect(location.geoType).toEqual(GeoTypes.REGION);
    });

    it(`/autocomplete/FR/all/argenteuil?geoType=${GeoTypes.CITY}`, async () => {
      const response = await app.inject({
        method: "GET",
        url: `/autocomplete/FR/all/argenteuil?geoType=${GeoTypes.CITY}`,
      });

      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body[0]).toBeDefined();
      expect(body.length).toBeGreaterThanOrEqual(1);

      const locations = body as LocationAutoCompleteAddress[];

      expect(locations[0].label).toEqual("Argenteuil (95100)");
      expect(locations[0].geoType).toEqual(GeoTypes.CITY);

      const places = locations.filter(
        (location) => location.geoType !== GeoTypes.CITY
      );
      expect(places.length).toEqual(0);
    });
  });

  describe("Autocomplete: extract geoType from url", () => {
    it(`/autocomplete/FR/all/departement-haute-garonne`, async () => {
      const response = await app.inject({
        method: "GET",
        url: `/autocomplete/FR/all/departement-haute-garonne`,
      });

      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body[0]).toBeDefined();
      expect(body.length).toEqual(1);

      const location = body[0] as LocationAutoCompleteAddress;
      expect(location.region).toBeDefined();
      expect(location.department).toBeDefined();
      expect(location.department).toEqual("Haute-Garonne");
      expect(location.region).toEqual("Occitanie");
      expect(location.geoType).toEqual(GeoTypes.DEPARTMENT);
    });

    it(`/autocomplete/FR/all/region-centre`, async () => {
      const response = await app.inject({
        method: "GET",
        url: `/autocomplete/FR/all/region-centre`,
      });

      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body[0]).toBeDefined();
      expect(body.length).toEqual(1);

      const location = body[0] as LocationAutoCompleteAddress;
      expect(location.region).toBeDefined();
      expect(location.department).toBeUndefined();
      expect(location.region).toEqual("Centre-Val de Loire");
      expect(location.geoType).toEqual(GeoTypes.REGION);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
