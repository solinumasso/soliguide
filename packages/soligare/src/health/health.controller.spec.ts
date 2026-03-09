import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PostgresHealthIndicator } from './postgres-health.service';

import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PairingModule } from '../pairing/pairing.module';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [ConfigModule, TerminusModule, HttpModule, PairingModule],
      providers: [PostgresHealthIndicator],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
