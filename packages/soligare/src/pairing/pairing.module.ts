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
