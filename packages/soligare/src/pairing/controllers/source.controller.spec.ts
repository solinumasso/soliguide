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
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { HealthModule } from '../../health/health.module';
import {
  dummyPlaceId1,
  dummyPlaceId2,
  dummyPlaceSource1,
} from '../../../test/mock/constants';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_VALIDATOR } from '../../config';
import { PairingModule } from '../pairing.module';

describe('SourceController', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PairingModule,
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        HealthModule,
      ],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('/POST source/available', () => {
    it('✅ without territories', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/source/available',
          body: {},
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual([
            'custom_source_name',
            'test_source_name',
          ]);
        });
    });
    it('✅ with territories', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/source/available',
          body: { territories: ['75'] },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual(['custom_source_name']);
        });
    });
  });

  describe('/GET source/details/:source_id', () => {
    it('✅ valid id', async () => {
      return await app
        .inject({
          method: 'GET',
          url: `/source/details/${dummyPlaceId2}`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual(
            JSON.parse(dummyPlaceSource1),
          );
        });
    });
    it('❌ invalid id', async () => {
      return await app
        .inject({
          method: 'GET',
          url: `/source/details/${dummyPlaceId1}`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
