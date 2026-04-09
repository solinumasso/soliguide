import { type Document } from 'mongodb';
import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions, buildPlaceAndServiceCondition } from './utils';

export class AudienceQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const audience = query.audience;
    const conditions: Document[] = [];
    const admissionPolicy = audience?.admissionPolicy;
    const isTargeted = audience?.isTargeted;
    const administrativeStatuses = audience?.administrativeStatuses;
    const familySituations = audience?.familySituations;
    const genders = audience?.genders;
    const otherCharacteristics = audience?.otherCharacteristics;
    const minAge = audience?.age?.min;
    const maxAge = audience?.age?.max;

    if (admissionPolicy) {
      const expectedAccueilValue = admissionPolicy === 'open' ? 0 : { $ne: 0 };
      conditions.push(
        buildPlaceAndServiceCondition('publics.accueil', expectedAccueilValue),
      );
    }

    if (isTargeted !== undefined) {
      conditions.push(
        buildPlaceAndServiceCondition(
          'publics.accueil',
          isTargeted ? { $ne: 0 } : 0,
        ),
      );
    }

    if (administrativeStatuses?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.administrative`, {
          $in: administrativeStatuses,
        }),
      );
    }

    if (familySituations?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.familialle`, {
          $in: familySituations,
        }),
      );
    }

    if (genders?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.gender`, {
          $in: genders,
        }),
      );
    }

    if (otherCharacteristics?.length) {
      conditions.push(
        buildPlaceAndServiceCondition(`publics.other`, {
          $in: otherCharacteristics,
        }),
      );
    }

    if (minAge !== undefined || maxAge !== undefined) {
      const placeAgeCondition: Document = {};
      const serviceAgeCondition: Document = {};

      if (minAge !== undefined) {
        placeAgeCondition['publics.age.max'] = { $gte: minAge };
        serviceAgeCondition['publics.age.max'] = { $gte: minAge };
      }

      if (maxAge !== undefined) {
        placeAgeCondition['publics.age.min'] = { $lte: maxAge };
        serviceAgeCondition['publics.age.min'] = { $lte: maxAge };
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
