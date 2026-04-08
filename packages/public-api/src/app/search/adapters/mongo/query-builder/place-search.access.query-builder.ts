import { type Document } from 'mongodb';
import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions, buildPlaceAndServiceCondition } from './utils';

const ACCESS_MODE_FIELD_MAP: Record<string, string> = {
  appointment: 'appointment',
  registration: 'inscription',
  orientation: 'orientation',
};

export class AccessQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const conditions: Document[] = [];

    if (query.accessKind === 'unconditional') {
      conditions.push(
        buildPlaceAndServiceCondition('modalities.inconditionnel', true),
      );
    }

    if (query.accessKind === 'conditional') {
      conditions.push(
        buildPlaceAndServiceCondition('modalities.inconditionnel', false),
      );
    }

    if (query.accessModes?.length) {
      const modeConditions = query.accessModes
        .map((mode) => ACCESS_MODE_FIELD_MAP[mode])
        .filter((legacyFieldName): legacyFieldName is string =>
          Boolean(legacyFieldName),
        )
        .map((legacyFieldName) => ({
          [`modalities.${legacyFieldName}.checked`]: true,
        }));

      if (modeConditions.length) {
        conditions.push({
          $or: [
            { $or: modeConditions },
            {
              services_all: {
                $elemMatch: {
                  $or: modeConditions,
                },
              },
            },
          ],
        });
      }
    }

    return appendAndConditions(context, conditions);
  }
}
