import { PlaceSearchQueryBuilder } from './place-search.query-builder';
import { type SearchQuery } from '../../../search.types';
import { describe, expect, it } from 'vitest';

describe('MongoPlaceSearchQueryBuilder', () => {
  const builder = new PlaceSearchQueryBuilder();

  function build(query: SearchQuery) {
    return builder.build(query, { page: 1, limit: 20 });
  }

  it('builds a country-based match pipeline', () => {
    const { resultsPipeline, countPipeline } = build({
      location: {
        country: 'FR',
      },
    });

    expect(resultsPipeline[0]).toEqual({
      $match: {
        $and: [{ 'position.country': 'fr' }],
      },
    });
    expect(countPipeline[countPipeline.length - 1]).toEqual({
      $count: 'totalResults',
    });
  });

  it('builds geo-near pipeline for coordinates with distance sort', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'FR',
        radiusKm: 10,
        coordinates: {
          latitude: 48.85,
          longitude: 2.35,
        },
      },
    });
    const geoNearStage = resultsPipeline[0] as {
      $geoNear: {
        near: { type: 'Point'; coordinates: [number, number] };
        maxDistance: number;
        query: { $and: Record<string, unknown>[] };
      };
    };

    expect(geoNearStage.$geoNear).toEqual(
      expect.objectContaining({
        near: {
          type: 'Point',
          coordinates: [2.35, 48.85],
        },
        maxDistance: 10000,
      }),
    );
    expect(geoNearStage.$geoNear.query.$and).toContainEqual({
      'position.country': 'fr',
    });
    expect(resultsPipeline[1]).toEqual({
      $sort: { distance: 1, updatedAt: -1 },
    });
  });

  it('supports coordinates and radius with non-point location mode', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'fr',
        city: { value: 'Paris' },
        coordinates: {
          latitude: 48.85,
          longitude: 2.35,
        },
        radiusKm: 5,
      },
    });

    const geoNearStage = resultsPipeline[0] as {
      $geoNear: {
        near: { type: 'Point'; coordinates: [number, number] };
        maxDistance?: number;
        query: { $and: Record<string, unknown>[] };
      };
    };

    expect(geoNearStage.$geoNear).toEqual(
      expect.objectContaining({
        near: {
          type: 'Point',
          coordinates: [2.35, 48.85],
        },
        maxDistance: 5000,
      }),
    );
    expect(geoNearStage.$geoNear.query.$and).toContainEqual({
      'position.country': 'fr',
    });
    expect(geoNearStage.$geoNear.query.$and).toContainEqual({
      'position.slugs.city': 'paris',
    });
  });

  it('applies category constraints when geo-near is enabled', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'fr',
        coordinates: {
          latitude: 48.85,
          longitude: 2.35,
        },
        radiusKm: 5,
      },
      categories: ['disability_advice'],
    });

    const geoNearStage = resultsPipeline[0] as {
      $geoNear: {
        query: { $and: Record<string, unknown>[] };
      };
    };

    expect(geoNearStage.$geoNear.query.$and).toContainEqual({
      services_all: {
        $elemMatch: {
          category: {
            $in: ['disability_advice'],
          },
        },
      },
    });
  });

  it('applies administrative division filters from sanitized input', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'FR',
        administrativeDivision: {
          departmentCode: '75',
          regionCode: '11',
          region: 'Île-de-France',
        },
      },
    });
    const matchStage = resultsPipeline[0] as {
      $match: { $and: Record<string, unknown>[] };
    };
    const andConditions = matchStage.$match.$and;

    expect(andConditions).toContainEqual({ 'position.country': 'fr' });
    expect(andConditions).not.toContainEqual({ 'position.country': 'FR' });
    expect(andConditions).toContainEqual({ 'position.regionCode': '11' });
    expect(andConditions).toContainEqual({ 'position.departmentCode': '75' });
    expect(andConditions).toContainEqual({
      'position.slugs.region': 'ile-de-france',
    });
    expect(andConditions).not.toContainEqual({
      'position.slugs.department': '',
    });
  });

  it('adds category, access, audience, and language constraints', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'FR',
      },
      categories: ['food'],
      access: {
        kind: 'conditional',
        modes: ['appointment'],
      },
      audience: {
        genders: ['women'],
      },
      language: 'fr',
    });

    const serialized = JSON.stringify(resultsPipeline);

    expect(serialized).toContain('"services_all"');
    expect(serialized).toContain('"category"');
    expect(serialized).toContain('"modalities.inconditionnel"');
    expect(serialized).toContain('"modalities.appointment.checked"');
    expect(serialized).toContain('"publics.gender"');
    expect(serialized).toContain('"languages"');
  });

  it('uses mongo-native audience values for publics.other filters', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'FR',
      },
      audience: {
        otherCharacteristics: ['handicap', 'lgbt', 'mentalHealth'],
      },
    });

    const serialized = JSON.stringify(resultsPipeline);
    expect(serialized).toContain('"publics.other"');
    expect(serialized).toContain('"handicap"');
    expect(serialized).toContain('"lgbt"');
    expect(serialized).toContain('"mentalHealth"');
    expect(serialized).not.toContain('"lgbt+"');
    expect(serialized).not.toContain('"disability"');
  });

  it('uses updatedAt.on as an exact day filter and ignores range overlap', () => {
    const { resultsPipeline } = build({
      location: {
        country: 'FR',
      },
      updatedAt: {
        on: '2026-03-26',
        before: '2026-03-25',
        after: '2026-03-24',
      },
    });

    const serialized = JSON.stringify(resultsPipeline);
    expect(serialized).toContain('2026-03-26T00:00:00.000Z');
    expect(serialized).toContain('2026-03-26T23:59:59.999Z');
    expect(serialized).not.toContain('2026-03-25T23:59:59.999Z');
    expect(serialized).not.toContain('2026-03-24T00:00:00.000Z');
  });
});
