import { Injectable, Provider } from '@nestjs/common';
import {
  Place20260303DTO,
  SearchResponse20260303DTO,
} from './search.2026-03-03.dto';
import {
  Place20260309DTO,
  SearchResponse20260309DTO,
} from './search.2026-03-09.dto';
import { searchResponseDowngradeMapperToken } from './search.versioning';
import { DowngradeMapper } from './versioning/version-mapper.types';

@Injectable()
export class Place20260309To20260303DowngradeMapper implements DowngradeMapper<
  Place20260309DTO,
  Place20260303DTO
> {
  downgrade(place: Place20260309DTO): Place20260303DTO {
    return {
      id: place.id,
      slug: place.seoUrl,
      name: place.name.translatedName,
      description: place.description,
      type: place.type,
      isOpenToday: place.isOpenToday,
      languages: place.languages,
    };
  }
}

@Injectable()
export class SearchResponse20260309To20260303DowngradeMapper implements DowngradeMapper<
  SearchResponse20260309DTO,
  SearchResponse20260303DTO
> {
  constructor(
    private readonly place20260309To20260303DowngradeMapper: Place20260309To20260303DowngradeMapper,
  ) {}

  downgrade(response: SearchResponse20260309DTO): SearchResponse20260303DTO {
    const downgradedPlaces = response.results.map((result) =>
      this.place20260309To20260303DowngradeMapper.downgrade(result),
    );

    return {
      _links: response._links,
      results: downgradedPlaces,
      page: response.page,
    };
  }
}

const searchResponseDowngradeMapperDefinitions = [
  {
    version: '2026-03-09',
    mapper: SearchResponse20260309To20260303DowngradeMapper,
  },
] as const;

export const searchResponseDowngradeMapperProviders: Provider[] = [
  Place20260309To20260303DowngradeMapper,
  SearchResponse20260309To20260303DowngradeMapper,
  ...searchResponseDowngradeMapperDefinitions.map((definition) => ({
    provide: searchResponseDowngradeMapperToken(definition.version),
    useExisting: definition.mapper,
  })),
];
