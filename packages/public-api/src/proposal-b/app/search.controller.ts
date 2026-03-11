import { Controller, Get, Headers, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchService } from '../../application/search.service';
import { VersioningEngine } from '../runtime/versioning.engine';

function normalizeOpenToday(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y', 'on'].includes(value.toLowerCase());
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return Boolean(value);
}

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly versioningEngine: VersioningEngine,
  ) {}

  @Get()
  @ApiOperation({
    operationId: 'search_places',
    summary: 'Search places',
  })
  @ApiHeader({
    name: 'x-api-version',
    required: false,
    description: 'Date-based API version (YYYY-MM-DD or vYYYY-MM-DD).',
  })
  @ApiOkResponse({
    description: 'Successful search response',
  })
  async search(
    @Query() query: Record<string, unknown>,
    @Headers('x-api-version') versionHeader?: string,
  ): Promise<unknown> {
    const upgradedRequest = await this.versioningEngine.upgradeRequest(
      query,
      versionHeader,
      {
        deps: {
          normalizeOpenToday,
        },
      },
    );

    const canonicalResponse = await this.searchService.search();

    return this.versioningEngine.downgradeResponse(
      canonicalResponse,
      versionHeader,
      {
        deps: {
          upgradedRequest,
        },
      },
    );
  }
}
