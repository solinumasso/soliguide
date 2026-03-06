import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { PostgresService } from '../pairing/services';

@Injectable()
export class PostgresHealthIndicator {
  constructor(
    private readonly postgresService: PostgresService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.postgresService.checkConnection();
      return indicator.up();
    } catch (error) {
      return indicator.down('Postgres check failed');
    }
  }
}
