import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SearchResponse20260303DTO } from './search.2026-03-03.dto';
import { SearchResponse20260309DTO } from './search.2026-03-09.dto';
import { ApiExtraModels, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SearchService } from '../application/search.service';
import { SearchVersioningInterceptor } from './search-versioning.interceptor';

@Controller('search')
@UseInterceptors(SearchVersioningInterceptor)
@ApiExtraModels(SearchResponse20260303DTO, SearchResponse20260309DTO)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    operationId: 'search_places',
    summary: 'Search places',
  })
  @ApiOkResponse({ type: SearchResponse20260309DTO })
  search(): Promise<SearchResponse20260309DTO> {
    return this.searchService.search();
  }
}
