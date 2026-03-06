import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PairingController } from './controllers/pairing.controller';
import { PairingService, PostgresService, SourceService } from './services';
import { StructureService } from './services/structure.service';
import { SourceController } from './controllers/source.controller';

@Module({
  controllers: [PairingController, SourceController],
  providers: [PairingService, StructureService, SourceService, PostgresService],
  imports: [ConfigModule],
  exports: [PostgresService],
})
export class PairingModule {}
