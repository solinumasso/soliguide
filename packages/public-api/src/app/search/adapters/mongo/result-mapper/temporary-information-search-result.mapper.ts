import { type SearchTemporaryInformation } from '../../../search.types';
import { type MongoTempInfos } from '../place.mongo';
import { toIsoDateTime } from './result-mapper.shared';
import { type ScheduleSearchResultMapper } from './schedule-search-result.mapper';

export class TemporaryInformationSearchResultMapper {
  constructor(private readonly scheduleMapper: ScheduleSearchResultMapper) {}

  map(tempInfos?: MongoTempInfos): SearchTemporaryInformation {
    return {
      closures:
        tempInfos?.closure?.dateDebut && tempInfos?.closure?.dateFin
          ? [
              {
                startDate: toIsoDateTime(tempInfos.closure.dateDebut),
                endDate: toIsoDateTime(tempInfos.closure.dateFin),
                description: tempInfos.closure.description ?? '',
              },
            ]
          : [],
      scheduleAdjustments:
        tempInfos?.hours?.dateDebut && tempInfos?.hours?.dateFin
          ? [
              {
                startDate: toIsoDateTime(tempInfos.hours.dateDebut),
                endDate: toIsoDateTime(tempInfos.hours.dateFin),
                description: tempInfos.hours.description ?? '',
                schedule: this.scheduleMapper.map(tempInfos.hours.hours),
              },
            ]
          : [],
      messages:
        tempInfos?.message?.dateDebut && tempInfos?.message?.dateFin
          ? [
              {
                title: tempInfos.message.name ?? '',
                startDate: toIsoDateTime(tempInfos.message.dateDebut),
                endDate: toIsoDateTime(tempInfos.message.dateFin),
                description: tempInfos.message.description ?? '',
              },
            ]
          : [],
    };
  }
}
