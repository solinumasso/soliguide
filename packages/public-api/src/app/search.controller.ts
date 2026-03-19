import { Controller, Get, Headers, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { VersioningEngine } from '../api-versioning/runtime/versioning.engine';

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
    await this.versioningEngine.upgradeRequest(query, versionHeader);

    const canonicalResponse = await this.searchService.search();

    return this.versioningEngine.downgradeResponse(
      canonicalResponse,
      versionHeader,
    );
  }
}
