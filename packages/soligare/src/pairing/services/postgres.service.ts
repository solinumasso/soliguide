import { Global, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { captureException, captureMessage } from '@sentry/nestjs';
import postgres from 'postgres';

@Global()
@Injectable()
export class PostgresService implements OnApplicationShutdown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly connection: postgres.Sql<any>;

  constructor(private readonly configService: ConfigService) {
    try {
      // skipcq: JS-0339
      const username: string = this.configService.get<string>(
        'POSTGRES_EXTERNAL_USERNAME',
      )!;
      // skipcq: JS-0339
      const password: string = this.configService.get<string>(
        'POSTGRES_EXTERNAL_PASSWORD',
      )!;
      // skipcq: JS-0339
      const host: string = this.configService.get<string>(
        'POSTGRES_EXTERNAL_HOST',
      )!;
      // skipcq: JS-0339
      const port: number = this.configService.get<number>(
        'POSTGRES_EXTERNAL_PORT',
      )!;
      // skipcq: JS-0339
      const database: string = this.configService.get<string>(
        'POSTGRES_EXTERNAL_DATABASE',
      )!;

      this.connection = postgres('', {
        username,
        password,
        host,
        port,
        database,
      });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      await this.connection.begin(async (sql: any) => {
        await sql`SELECT NOW()`;
      });
    } catch (error) {
      captureMessage('[SOLIGARE] Postgres connection is down');
      captureException(error);
      throw new Error('[SOLIGARE] Postgres connection check failed');
    }
  }
}
