import { Injectable } from '@nestjs/common';
import { PlaceType } from '@soliguide/common';
import { categories as apiCategories } from '../../../../api/schema/2026-03-03/search.response/category';
import { type SearchResult } from '../../../search.types';
import { type MongoPlaceDocument } from '../place.mongo';
import { AccessSearchResultMapper } from './access-search-result.mapper';
import { AudienceSearchResultMapper } from './audience-search-result.mapper';
import { ContactSearchResultMapper } from './contact-search-result.mapper';
import { LocationSearchResultMapper } from './location-search-result.mapper';
import { toIsoDateTime } from './result-mapper.shared';
import { ScheduleSearchResultMapper } from './schedule-search-result.mapper';
import { ServiceSearchResultMapper } from './service-search-result.mapper';
import { TemporaryInformationSearchResultMapper } from './temporary-information-search-result.mapper';

@Injectable()
export class SearchResultMapper {
  private readonly contactMapper = new ContactSearchResultMapper();
  private readonly accessMapper = new AccessSearchResultMapper();
  private readonly audienceMapper = new AudienceSearchResultMapper();
  private readonly locationMapper = new LocationSearchResultMapper();
  private readonly scheduleMapper = new ScheduleSearchResultMapper();
  private readonly temporaryInformationMapper =
    new TemporaryInformationSearchResultMapper(this.scheduleMapper);
  private readonly serviceMapper = new ServiceSearchResultMapper(
    this.accessMapper,
    this.audienceMapper,
    this.scheduleMapper,
    new Set(apiCategories),
  );

  mapPlace(document: MongoPlaceDocument): SearchResult {
    const baseResult = {
      id: String(document.lieu_id ?? document._id),
      name: document.name ?? '',
      description: document.description ?? '',
      slug: document.seo_url ?? document.slugs?.infos?.name ?? '',
      languages: Array.isArray(document.languages) ? document.languages : [],
      contact: this.contactMapper.map(document.entity),
      access: this.accessMapper.map(document.modalities),
      audience: this.audienceMapper.map(document.publics),
      temporaryInformation: this.temporaryInformationMapper.map(
        document.tempInfos,
      ),
      services: this.serviceMapper.map(document.services_all, document),
      isOpenToday: document.isOpenToday ?? false,
      updatedAt: toIsoDateTime(document.updatedAt),
    };

    if (document.placeType === PlaceType.ITINERARY) {
      return {
        ...baseResult,
        type: 'itinerary',
        stops: Array.isArray(document.parcours)
          ? document.parcours.map((stop) => ({
              description: stop.description ?? null,
              location: this.locationMapper.map(stop.position),
              schedule: this.scheduleMapper.map(stop.hours),
            }))
          : [],
      };
    }

    return {
      ...baseResult,
      type: 'fixedLocation',
      location: this.locationMapper.map(document.position),
      schedule: this.scheduleMapper.map(document.newhours),
    };
  }
}
