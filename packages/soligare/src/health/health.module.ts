import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PostgresHealthIndicator } from './postgres-health.service';
import { PairingModule } from '../pairing/pairing.module';

@Module({
  imports: [TerminusModule, PairingModule],
  controllers: [HealthController],
  providers: [PostgresHealthIndicator],
  exports: [PostgresHealthIndicator],
})
export class HealthModule {}
