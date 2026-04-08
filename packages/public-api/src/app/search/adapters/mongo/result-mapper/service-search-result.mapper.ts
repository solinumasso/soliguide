import { ServiceSaturation } from '@soliguide/common';
import { type SearchServiceItem } from '../../../search.types';
import { type MongoPlaceDocument } from '../place.mongo';
import { type AccessSearchResultMapper } from './access-search-result.mapper';
import { type AudienceSearchResultMapper } from './audience-search-result.mapper';
import { type ScheduleSearchResultMapper } from './schedule-search-result.mapper';

export class ServiceSearchResultMapper {
  constructor(
    private readonly accessMapper: AccessSearchResultMapper,
    private readonly audienceMapper: AudienceSearchResultMapper,
    private readonly scheduleMapper: ScheduleSearchResultMapper,
    private readonly validResponseCategories: Set<string>,
  ) {}

  map(
    services: MongoPlaceDocument['services_all'],
    place: MongoPlaceDocument,
  ): SearchServiceItem[] {
    if (!Array.isArray(services)) {
      return [];
    }

    return services.map((service, index) => {
      const category = this.validResponseCategories.has(service.category ?? '')
        ? (service.category as string)
        : 'welcome';

      return {
        id: String(
          service.serviceObjectId ?? `${place.lieu_id ?? 'place'}_${index}`,
        ),
        category,
        description: service.description ?? '',
        saturation: {
          level:
            service.saturated?.status === ServiceSaturation.HIGH
              ? 'high'
              : 'low',
          details: service.saturated?.precision ?? null,
        },
        isOpenToday: service.isOpenToday ?? false,
        access: service.differentModalities
          ? this.accessMapper.map(service.modalities)
          : null,
        audience: service.differentPublics
          ? this.audienceMapper.map(service.publics)
          : null,
        schedule: service.differentHours
          ? this.scheduleMapper.map(service.hours)
          : null,
      };
    });
  }
}
