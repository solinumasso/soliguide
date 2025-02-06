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
import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SearchResults, ExternalStructure } from '@soliguide/common';

import { StructureToPairDto, PairBodyDto } from './dto/source';

import { SourceIdDto, PairingDto } from './dto';

import { PairingService } from './service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { StructureService } from './service/format/structure.service';

@Controller('pairing')
export class PairingController {
  constructor(
    private pairingService: PairingService,
    private structureService: StructureService,
  ) {}

  @ApiOperation({
    summary: 'List of external structures to pair',
  })
  @ApiResponse({
    status: 200,
  })
  @Post('to-pair')
  @HttpCode(200)
  public async getExternalStructureToPair(
    @Body() bodyParam: StructureToPairDto,
  ): Promise<SearchResults<ExternalStructure>> {
    const externalStructures =
      await this.pairingService.getStructureToPair(bodyParam);

    const countExternalStructures =
      await this.pairingService.countStructureToPair(
        bodyParam?.sources,
        bodyParam?.territories,
      );

    return {
      nbResults: countExternalStructures,
      results: externalStructures,
    };
  }

  @ApiOperation({
    summary: 'Pair source with soliguide',
  })
  @ApiResponse({
    status: 200,
  })
  @Post('pair')
  public async assignPair(
    @Body() bodyParam: PairBodyDto,
    @Res() res: FastifyReply,
  ) {
    await this.pairingService.pairingSourceWithSoliguide(
      bodyParam.source_id,
      bodyParam?.soliguide_id,
    );

    if (bodyParam.soliguide_id) {
      return res.status(HttpStatus.OK).send();
    }
    return res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({
    summary: 'Delete pairing',
  })
  @ApiResponse({
    status: 200,
  })
  @Delete('pair/:soliguide_id')
  public async unpairExternalStructure(
    @Param() bodyParam: PairingDto,
    @Res() res: FastifyReply,
  ) {
    await this.pairingService.deletePairing(bodyParam.soliguide_id);

    return res.status(HttpStatus.OK).send();
  }

  @ApiOperation({
    summary: 'Get external structure from source ID',
  })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Source ID not found',
  })
  @Get('external-structure/:source_id')
  public async externalStructureToSoliguideFormat(
    @Param() sourceId: SourceIdDto,
    @Res() res: FastifyReply,
  ) {
    const soliguideStructure =
      await this.structureService.getStructureByIdSoliguideFormat(
        sourceId.source_id,
      );

    if (Object.keys(soliguideStructure).length === 0) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.status(HttpStatus.OK).send(soliguideStructure);
  }
}
