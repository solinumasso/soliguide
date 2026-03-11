import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({ description: `1-based index of the current page` })
  current: number;

  @ApiProperty({ description: `Maximum number of results returned per page` })
  limit: number;

  @ApiProperty({
    description: 'Total number of matching results across all pages',
  })
  totalResults: number;

  @ApiProperty({
    description: 'Total number of pages available for this search',
  })
  totalPages: number;
}
