import { type Document } from 'mongodb';
import { type SearchAudience } from '../../../search.types';
import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions, buildPlaceAndServiceCondition } from './utils';

const AUDIENCE_OTHER_STATUS_MAP: Record<
  string,
  SearchAudience['otherStatuses']
> = {
  violence: 'violence',
  addiction: 'addiction',
  disability: 'disability',
  lgbtqPlus: 'lgbt+',
  'lgbt+': 'lgbt+',
  hiv: 'hiv',
  sexWork: 'prostitution',
  prostitution: 'prostitution',
  prison: 'prison',
  student: 'student',
};

export class AudienceQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const conditions: Document[] = [];

    if (query.audienceAdmissionPolicy) {
      const expectedAccueilValue =
        query.audienceAdmissionPolicy === 'open' ? 0 : { $ne: 0 };
      conditions.push(
        buildPlaceAndServiceCondition('publics.accueil', expectedAccueilValue),
      );
    }

    if (query.audienceIsTargeted !== undefined) {
      conditions.push(
        buildPlaceAndServiceCondition(
          'publics.accueil',
          query.audienceIsTargeted ? { $ne: 0 } : 0,
        ),
      );
    }

    if (query.audienceAdministrativeStatuses?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.administrative`, {
          $in: query.audienceAdministrativeStatuses,
        }),
      );
    }

    if (query.audienceFamilySituations?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.familialle`, {
          $in: query.audienceFamilySituations,
        }),
      );
    }

    if (query.audienceGenders?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.gender`, {
          $in: query.audienceGenders,
        }),
      );
    }

    if (query.audienceOtherCharacteristics?.length) {
      const normalizedOtherStatuses = query.audienceOtherCharacteristics
        .map((value) => AUDIENCE_OTHER_STATUS_MAP[value])
        .filter((value): value is SearchAudience['otherStatuses'] =>
          Boolean(value),
        );

      if (normalizedOtherStatuses.length) {
        conditions.push(
          buildPlaceAndServiceCondition(`publics.other`, {
            $in: normalizedOtherStatuses,
          }),
        );
      }
    }

    if (
      query.audienceMinAge !== undefined ||
      query.audienceMaxAge !== undefined
    ) {
      const placeAgeCondition: Document = {};
      const serviceAgeCondition: Document = {};

      if (query.audienceMinAge !== undefined) {
        placeAgeCondition['publics.age.max'] = { $gte: query.audienceMinAge };
        serviceAgeCondition['publics.age.max'] = { $gte: query.audienceMinAge };
      }

      if (query.audienceMaxAge !== undefined) {
        placeAgeCondition['publics.age.min'] = { $lte: query.audienceMaxAge };
        serviceAgeCondition['publics.age.min'] = { $lte: query.audienceMaxAge };
      }

      conditions.push({
        $or: [
          placeAgeCondition,
          {
            services_all: {
              $elemMatch: serviceAgeCondition,
            },
          },
        ],
      });
    }

    return appendAndConditions(context, conditions);
  }
}
