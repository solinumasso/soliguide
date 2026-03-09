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
