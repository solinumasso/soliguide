import { ApiProperty } from '@nestjs/swagger';
import { SearchCollectionLinksDTO } from './hateoas.dto';
import { PaginationDTO } from './pagination.dto';

const placeTypes = ['place', 'itinerary'] as const;
type PlaceType = (typeof placeTypes)[number];

export class Place20260303DTO {
  @ApiProperty({
    description: 'Stable unique identifier of the place',
    example: '43510',
  })
  id: string;

  @ApiProperty({
    description: 'URL-friendly identifier of the place',
    example: 'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
  })
  slug: string;

  @ApiProperty({
    description: `Localized place name in the requested language`,
    example: `Croix-Rouge française - Antenne Locale de Saint Benoit`,
  })
  name: string;

  @ApiProperty({
    description: `Localized place description in the requested language`,
    example: `<p>L'Antenne Locale est chargée de mettre en œuvre les actions de proximité de la Croix-Rouge française afin de répondre aux besoins locaux. Il peut s’agir entre autres d’aides et de services d’urgence et/ou d’inclusion sociale.</p>`,
  })
  description: string;

  @ApiProperty({
    description:
      '- "place": service at a fixed location,\n- "itinerary": mobile service that changes location on a recurring schedule (for example, different stops depending on the day).',
    enum: placeTypes,
    example: 'place',
  })
  type: PlaceType;

  @ApiProperty({
    description: `Whether the place is open at some point today`,
    example: true,
  })
  isOpenToday: boolean;

  @ApiProperty({
    description: `Languages spoken at the place (<a href="https://en.wikipedia.org/wiki/ISO_639-3" target="_blank">ISO 639-3 codes</a>)`,
    example: ['fr', 'rcf'],
  })
  languages: string[];
}

export class SearchResponse20260303DTO {
  @ApiProperty({
    type: SearchCollectionLinksDTO,
    description: `Navigation links for this search result set`,
    example: {
      self: { href: '/search?page=1&limit=100' },
      next: { href: '/search?page=2&limit=100' },
      prev: { href: '/search?page=1&limit=100' },
    },
  })
  _links: SearchCollectionLinksDTO;

  @ApiProperty({
    type: [Place20260303DTO],
    description: `Places returned for the current page`,
  })
  results: Place20260303DTO[];

  @ApiProperty({
    type: PaginationDTO,
    description: `Pagination metadata for this search result set`,
    example: {
      current: 1,
      limit: 100,
      totalResults: 0,
      totalPages: 1,
    },
  })
  page: PaginationDTO;
}
