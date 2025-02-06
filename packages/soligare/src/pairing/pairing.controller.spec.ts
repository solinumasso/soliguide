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
import { PostgresService } from './service';
import {
  dummyPlaceId1,
  dummyPlaceId2,
  dummyExpectedResultsPairingToPair1,
  dummyExpectedResultsPairingToPair2,
  dummyExpectedResultsFormatSourceIdToSoliguideFormat,
} from '../../test/mock/constants';
import { MockModule } from '../../test/mock/mock.module';
import { HealthModule } from '../health/health.module';

async function refreshDatabase(
  postgresService: PostgresService,
): Promise<void> {
  const connection = postgresService.getConnection();
  await connection`
    update
      dagster_structure.ids
    set
      soliguide_id = NULL
    `;
  await connection`
    update
      dagster_structure.sources
    set
      is_origin = ${false}
    where name = 'custom_source_name'
    `;
}

describe('PairingController', () => {
  let app: NestFastifyApplication;
  let postgresService: PostgresService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockModule, HealthModule],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    postgresService = module.get<PostgresService>(PostgresService);
  });

  beforeEach(async () => {
    await refreshDatabase(postgresService);
    jest
      .useFakeTimers({
        doNotFake: ['nextTick', 'setImmediate'],
        advanceTimers: 1000,
      })
      .setSystemTime(new Date('2024-10-25T00:00:00.000Z'));
  });
  describe('/POST pairing/to-pair', () => {
    it('✅ without territories / without sources', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/to-pair',
          body: {
            options: { page: 1, limit: 10 },
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual({
            nbResults: 2,
            results: [
              dummyExpectedResultsPairingToPair1,
              dummyExpectedResultsPairingToPair2,
            ],
          });
        });
    });
    it('✅ without territories / with sources', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/to-pair',
          body: {
            options: { page: 1, limit: 10 },
            sources: ['custom_source_name'],
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual({
            nbResults: 1,
            results: [dummyExpectedResultsPairingToPair2],
          });
        });
    });
    it('✅ with territories / without sources', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/to-pair',
          body: {
            options: { page: 1, limit: 10 },
            territories: ['22'],
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual({
            nbResults: 1,
            results: [dummyExpectedResultsPairingToPair1],
          });
        });
    });
    it('✅ with territories / with sources', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/to-pair',
          body: {
            options: { page: 1, limit: 10 },
            territories: ['22'],
            sources: ['test_source_name'],
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual({
            nbResults: 1,
            results: [dummyExpectedResultsPairingToPair1],
          });
        });
    });
  });

  describe('/POST pairing/pair', () => {
    it('✅ Pair with Soliguide ID', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/pair',
          body: {
            source_id: dummyPlaceId2,
            soliguide_id: 5432,
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('✅ Pair without Soliguide ID', async () => {
      return await app
        .inject({
          method: 'POST',
          url: '/pairing/pair',
          body: {
            source_id: dummyPlaceId2,
          },
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.CREATED);
        });
    });
  });

  describe('/DELETE pairing/pair/:soliguide_id', () => {
    it('✅ Unpair', async () => {
      return await app
        .inject({
          method: 'DELETE',
          url: `/pairing/pair/5432`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  describe('/POST pairing/external-structure/:source_id', () => {
    it('✅ Convert External Structure to Soliguide Place', async () => {
      return await app
        .inject({
          method: 'GET',
          url: `/pairing/external-structure/${dummyPlaceId2}`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.OK);
          expect(JSON.parse(results.payload)).toEqual(
            dummyExpectedResultsFormatSourceIdToSoliguideFormat,
          );
        });
    });

    it('❌ Source ID not found', async () => {
      return await app
        .inject({
          method: 'GET',
          url: `/pairing/external-structure/${dummyPlaceId1}`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });
    it('❌ Not a UUID', async () => {
      return await app
        .inject({
          method: 'GET',
          url: `/pairing/external-structure/1234`,
        })
        .then((results) => {
          expect(results.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });
  });

  afterAll(async () => {
    await refreshDatabase(postgresService);
    await app.close();
  });
});
