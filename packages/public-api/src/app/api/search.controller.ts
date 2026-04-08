import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SearchService } from '../search/search.service';
import { ApiVersioningInterceptor } from './api-versioning.interceptor';
import type { SearchQuery, SearchResponse } from '../search/search.types';

@ApiTags('search')
@Controller('search')
@UseInterceptors(ApiVersioningInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({
    operationId: 'search_places',
    summary: 'Search places',
  })
  @ApiOkResponse({
    description: 'Successful search response',
  })
  async search(@Body() payload: SearchQuery): Promise<SearchResponse> {
    return this.searchService.search(payload);
  }
}
