import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { buildMatchStage } from './utils';

export class ProximityRankingQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (context.query.locationMode !== 'pointRadius') {
      return context;
    }

    const latitude = context.query.latitude;
    const longitude = context.query.longitude;

    if (latitude === undefined || longitude === undefined) {
      return context;
    }

    return {
      ...context,
      geoNearStage: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: (context.query.radiusKm ?? 0) * 1000,
        key: 'position.location',
        query: buildMatchStage(context.andConditions),
      },
    };
  }
}
