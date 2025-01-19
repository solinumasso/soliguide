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
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { captureException, captureMessage } from '@sentry/nestjs';
import postgres from 'postgres';

@Injectable()
export class PostgresService implements OnApplicationShutdown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly connection: postgres.Sql<any>;

  constructor(private configService: ConfigService) {
    try {
      const config_url: string = this.configService.get<string>(
        'POSTGRES_EXTERNAL_URI',
      )!;
      this.connection = postgres(config_url);
    } catch (error) {
      captureMessage('Error connecting to postgres');
      captureException(error);
    }
  }

  getConnection() {
    return this.connection;
  }

  async onApplicationShutdown() {
    await this.connection.end();
  }

  async checkConnection() {
    try {
      await this.connection.begin(async (sql) => {
        await sql`SELECT NOW()`;
      });
    } catch (error) {
      captureMessage('[SOLIGARE] Postgres connection is down');
      captureException(error);
      throw new Error('[SOLIGARE] Postgres connection check failed');
    }
  }
}
