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
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';

import { SourceService } from '../services';
import { TerritoriesDto, SourceIdDto } from '../dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CommonPlaceSource } from '@soliguide/common';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @ApiOperation({
    summary: 'List available source',
  })
  @ApiResponse({
    status: 200,
  })
  @Post('available')
  @HttpCode(200)
  public async getSource(@Body() bodyParam: TerritoriesDto): Promise<string[]> {
    const availableSources = await this.sourceService.getAvailableSources(
      bodyParam.territories,
    );

    return availableSources;
  }

  @ApiOperation({
    summary: 'Get source details',
  })
  @ApiResponse({
    status: 200,
  })
  @Get('details/:source_id')
  public async getSourceDetails(
    @Param() sourceId: SourceIdDto,
    @Res() res: FastifyReply,
  ): Promise<CommonPlaceSource> {
    const sourceDetails = await this.sourceService.getDetails(
      sourceId.source_id,
    );

    if (!sourceDetails) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.status(HttpStatus.OK).send(sourceDetails);
  }
}
