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
      locationMode: 'country',
      country: 'FR',
    });

    expect(resultsPipeline[0]).toEqual({
      $match: {
        $and: [{ 'position.country': 'FR' }],
      },
    });
    expect(countPipeline[countPipeline.length - 1]).toEqual({
      $count: 'totalResults',
    });
  });

  it('builds geo-near pipeline for point radius with distance sort', () => {
    const { resultsPipeline } = build({
      locationMode: 'pointRadius',
      latitude: 48.85,
      longitude: 2.35,
      radiusKm: 10,
      country: 'fr',
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
      'position.country': 'FR',
    });
    expect(resultsPipeline[1]).toEqual({
      $sort: { distance: 1, updatedAt: -1 },
    });
  });

  it('applies administrative division filters from sanitized input', () => {
    const { resultsPipeline } = build({
      locationMode: 'administrativeDivision',
      country: 'FR',
      departmentCode: '75',
      regionCode: '11',
      region: 'Ile-de-France',
    });
    const matchStage = resultsPipeline[0] as {
      $match: { $and: Record<string, unknown>[] };
    };
    const andConditions = matchStage.$match.$and;

    expect(andConditions).toContainEqual({ 'position.country': 'FR' });
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
      locationMode: 'country',
      country: 'FR',
      categories: ['food'],
      accessKind: 'conditional',
      accessModes: ['appointment'],
      audienceGenders: ['women'],
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

  it('uses updatedOn as an exact day filter and ignores range overlap', () => {
    const { resultsPipeline } = build({
      locationMode: 'country',
      country: 'FR',
      updatedOn: '2026-03-26',
      updatedBefore: '2026-03-25',
      updatedAfter: '2026-03-24',
    });

    const serialized = JSON.stringify(resultsPipeline);
    expect(serialized).toContain('2026-03-26T00:00:00.000Z');
    expect(serialized).toContain('2026-03-26T23:59:59.999Z');
    expect(serialized).not.toContain('2026-03-25T23:59:59.999Z');
    expect(serialized).not.toContain('2026-03-24T00:00:00.000Z');
  });
});
