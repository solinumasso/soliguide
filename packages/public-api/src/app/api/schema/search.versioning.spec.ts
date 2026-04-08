import { GeoTypes } from '@soliguide/common';
import { describe, expect, it } from 'vitest';
import {
  requestSchemasByVersion,
  responseSchemasByVersion,
} from './contracts.generated';
import {
  searchOpenApiOperationTarget,
  searchVersioningDefinition,
} from './search.versioning';

describe('Search versioning definition', () => {
  it('registers expected versions in chronological order', () => {
    const versions = searchVersioningDefinition.versions.map(
      ({ version }) => version,
    );

    expect(versions).toEqual(['2026-01-01', '2026-03-03']);
    expect(searchOpenApiOperationTarget).toEqual({
      method: 'post',
      path: '/search',
    });
  });

  it('loads generated request and response schemas for both versions', () => {
    expect([...requestSchemasByVersion.keys()]).toEqual([
      '2026-01-01',
      '2026-03-03',
    ]);
    expect([...responseSchemasByVersion.keys()]).toEqual([
      '2026-01-01',
      '2026-03-03',
    ]);
  });

  it('validates request payloads for both versions', () => {
    const legacyRequest = {
      location: {
        geoType: GeoTypes.COUNTRY,
        geoValue: 'FR',
      },
    };
    const currentRequest = {
      location: {
        geoType: GeoTypes.COUNTRY,
        geoValue: 'FR',
      },
      options: {
        page: 1,
        limit: 20,
      },
    };

    expect(
      requestSchemasByVersion.get('2026-01-01')?.safeParse(legacyRequest)
        .success,
    ).toBe(true);
    expect(
      requestSchemasByVersion.get('2026-03-03')?.safeParse(currentRequest)
        .success,
    ).toBe(true);
  });

  it('validates response payloads for both versions', () => {
    const legacyResponse = {
      nbResults: 1,
      places: [
        {
          lieu_id: 123,
          name: 'Legacy place',
          description: 'Legacy description',
          isOpenToday: true,
          languages: ['fr'],
        },
      ],
    };
    const currentResponse = {
      nbResults: 1,
      places: [
        {
          type: 'fixedLocation',
          id: 123,
          name: 'Current place',
          description: 'Description',
          slug: 'current-place',
          languages: ['fr'],
          contacts: [
            {
              type: 'email',
              label: 'Email',
              value: 'contact@example.org',
            },
          ],
          access: {
            isUnconditional: false,
            allowPets: false,
            isWheelchairAccessible: false,
            appointmentRequirement: { isRequired: false, details: null },
            registrationRequirement: { isRequired: false, details: null },
            orientationRequirement: { isRequired: false, details: null },
            pricing: { isPaid: false, details: null },
            otherDetails: null,
          },
          audience: {
            admissionPolicy: 'open',
            isTargeted: false,
            description: 'General public',
            ageRange: null,
            administrativeStatuses: 'regular',
            familyStatuses: 'isolated',
            otherStatuses: 'student',
            genders: 'women',
            specialSupportContexts: [],
          },
          temporaryInformation: {
            closures: [],
            scheduleAdjustments: [],
            messages: [],
          },
          services: [],
          isOpenToday: true,
          updatedAt: '2026-03-26T10:15:00Z',
          location: {
            address: '10 rue Example',
            additionalInformation: 'Building B',
            postalCode: '75010',
            city: 'Paris',
            country: 'FR',
            timeZone: 'Europe/Paris',
            department: 'Paris',
            departmentCode: '75',
            region: 'Ile-de-France',
            regionCode: '11',
            location: {
              type: 'Point',
              coordinates: [2.3522, 48.8566],
            },
          },
          schedule: {
            weeklySchedule: [],
            publicHolidays: {
              status: 'unknown',
              openedHolidays: [],
            },
          },
        },
      ],
    };

    expect(
      responseSchemasByVersion.get('2026-01-01')?.safeParse(legacyResponse)
        .success,
    ).toBe(true);
    expect(
      responseSchemasByVersion.get('2026-03-03')?.safeParse(currentResponse)
        .success,
    ).toBe(true);
  });
});
