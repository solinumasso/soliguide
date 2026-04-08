import { SearchResultMapper } from './search-result.mapper';
import { type MongoPlaceDocument } from '../place.mongo';
import { describe, expect, it } from 'vitest';

describe('SearchResultMapper', () => {
  const mapper = new SearchResultMapper();

  it('maps a fixed location place with legacy field fallbacks', () => {
    const mapped = mapper.mapPlace({
      lieu_id: 42,
      name: 'Sample Place',
      description: 'Description',
      seo_url: 'sample-place',
      languages: ['fr'],
      position: {
        adresse: '10 rue test',
        codePostal: '75001',
        ville: 'Paris',
        pays: 'FR',
        timeZone: 'Europe/Paris',
        department: 'Paris',
        departmentCode: '75',
        region: 'Ile-de-France',
        regionCode: '11',
        location: { coordinates: [2.35, 48.85] },
      },
      modalities: { inconditionnel: true },
      publics: { accueil: 0 },
      services_all: [],
      newhours: {},
      tempInfos: {},
      updatedAt: '2026-03-26T10:15:00.000Z',
    } as MongoPlaceDocument);

    expect(mapped.type).toBe('fixedLocation');
    if (mapped.type !== 'fixedLocation') {
      return;
    }

    expect(mapped.id).toBe('42');
    expect(mapped.slug).toBe('sample-place');
    expect(mapped.location).toEqual(
      expect.objectContaining({
        address: '10 rue test',
        postalCode: '75001',
        city: 'Paris',
        country: 'FR',
        departmentCode: '75',
        regionCode: '11',
        location: {
          type: 'Point',
          coordinates: [2.35, 48.85],
        },
      }),
    );
  });

  it('maps itinerary records with stops', () => {
    const mapped = mapper.mapPlace({
      _id: 'mongo-id',
      placeType: 'PARCOURS_MOBILE',
      name: 'Bus social',
      languages: ['fr'],
      parcours: [
        {
          description: 'Stop 1',
          position: {
            address: '1 avenue',
            postalCode: '13001',
            city: 'Marseille',
            country: 'FR',
            location: { coordinates: [5.37, 43.29] },
          },
          hours: {},
        },
      ],
      services_all: [],
      newhours: {},
      tempInfos: {},
    } as unknown as MongoPlaceDocument);

    expect(mapped.type).toBe('itinerary');
    if (mapped.type !== 'itinerary') {
      return;
    }

    expect(mapped.id).toBe('mongo-id');
    expect(mapped.stops).toHaveLength(1);
    expect(mapped.stops[0].location.city).toBe('Marseille');
    expect(mapped.stops[0].location.location.coordinates).toEqual([
      5.37, 43.29,
    ]);
  });
});
