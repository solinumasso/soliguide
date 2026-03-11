import { ApiProperty } from '@nestjs/swagger';

export class LinkDTO {
  @ApiProperty({
    description: 'Absolute or relative URL to a related API resource',
    example: '/search?page=1&limit=100',
  })
  href: string;
}

export class ResourceLinksDTO {
  @ApiProperty({
    description: `Canonical URL for this resource`,
    type: LinkDTO,
    example: { href: '/search?page=1&limit=100' },
  })
  self: LinkDTO;
}

export class SearchCollectionLinksDTO {
  @ApiProperty({
    description: `Canonical URL for the current search page`,
    type: LinkDTO,
    example: { href: '/search?page=1&limit=100' },
  })
  self: LinkDTO;

  @ApiProperty({
    description: `URL for the next page of this search`,
    type: LinkDTO,
    example: { href: '/search?page=2&limit=100' },
  })
  next: LinkDTO;

  @ApiProperty({
    description: `URL for the previous page of this search`,
    type: LinkDTO,
    example: { href: '/search?page=1&limit=100' },
  })
  prev: LinkDTO;
}
