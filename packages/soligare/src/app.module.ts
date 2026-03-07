import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { CONFIG_VALIDATOR } from './config';
import { PairingModule } from './pairing/pairing.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PairingModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: CONFIG_VALIDATOR,
    }),
    LoggerModule.forRoot(),
  ],
})
export class AppModule {}
