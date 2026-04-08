import { PlaceClosedHolidays, ServiceSaturation } from '@soliguide/common';
import { describe, expect, it } from 'vitest';
import {
  DslCompiler,
  type ResponseDowngradeContext,
} from '../../../../../api-versioning/versioning';
import { SearchVersion20260303Provider } from '../20260303.version';
import {
  ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches,
  ReplaceModalitiesByAccess,
  ReplacePublicsByAudience,
  ReplaceServicesAllByServices,
  ReplaceTempInfosByTemporaryInformation,
} from './2026-03-03.search.response';

type SearchLegacyPlaceSnapshot = Record<string, unknown>;

const removeFieldNames = [
  '_id',
  'auto',
  'status',
  'visibility',
  'close',
  'sources',
  'updatedByUserAt',
  'slugs',
  'distance',
  'photos',
  'geoZones',
  'createdAt',
] as const;

describe('2026-03-03 remove-field downgrades', () => {
  it('restores removed legacy fields from context snapshots, including mongo _id', async () => {
    const compiler = new DslCompiler();
    const version = new SearchVersion20260303Provider().toVersion();

    const removeChanges = version.responseChanges.filter(
      (change): change is { field: string } =>
        'field' in change &&
        typeof (change as { field?: unknown }).field === 'string' &&
        removeFieldNames.includes(
          (change as { field: string })
            .field as (typeof removeFieldNames)[number],
        ),
    );

    const snapshots = new Map<string, SearchLegacyPlaceSnapshot>([
      [
        '123',
        {
          _id: '507f1f77bcf86cd799439011',
          auto: true,
          status: 'ONLINE',
          visibility: 'ALL',
          close: false,
          sources: [{ name: 'source' }],
          updatedByUserAt: '2026-03-01T09:00:00.000Z',
          slugs: { infos: { name: 'legacy-slug' } },
          distance: 12.5,
          photos: [{ filename: 'a.jpg' }],
          geoZones: [{ label: 'Paris' }],
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    ]);

    const context: ResponseDowngradeContext = {
      v20260303: {
        legacyById: snapshots,
      },
    };

    for (const change of removeChanges) {
      const compiled = compiler.compileResponseChange(change);

      const downgraded = await compiled.downgrade(
        { places: [{ id: '123' }] },
        context,
      );

      const place = (downgraded as { places: Array<Record<string, unknown>> })
        .places[0];
      const fieldName = String(change.field);
      expect(place[fieldName]).toEqual(snapshots.get('123')?.[fieldName]);
    }
  });

  it('uses deterministic undefined fallback when snapshot is missing', async () => {
    const compiler = new DslCompiler();
    const version = new SearchVersion20260303Provider().toVersion();
    const removeMongoObjectId = version.responseChanges.find(
      (change) =>
        'field' in change && (change as { field?: unknown }).field === '_id',
    );

    expect(removeMongoObjectId).toBeDefined();

    const compiled = compiler.compileResponseChange(
      removeMongoObjectId as Parameters<
        DslCompiler['compileResponseChange']
      >[0],
    );

    const downgraded = await compiled.downgrade(
      { places: [{ id: 'missing' }] },
      {
        v20260303: {
          legacyById: new Map(),
        },
      },
    );

    expect(
      (downgraded as { places: Array<Record<string, unknown>> }).places[0],
    ).toEqual({
      id: 'missing',
      _id: undefined,
    });
  });

  it('rebuilds legacy services_all including modalities, publics and hours', async () => {
    const compiled = new DslCompiler().compileResponseChange(
      new ReplaceServicesAllByServices(),
    );

    const downgraded = await compiled.downgrade(
      {
        places: [
          {
            id: '123',
            updatedAt: '2026-04-01T00:00:00.000Z',
            services: [
              {
                id: 'service_1',
                category: 'welcome',
                description: 'Front-desk support',
                saturation: { level: 'high', details: 'Busy in the morning' },
                isOpenToday: true,
                access: {
                  isUnconditional: false,
                  allowPets: true,
                  isWheelchairAccessible: false,
                  appointmentRequirement: {
                    isRequired: true,
                    details: 'Call before',
                  },
                  registrationRequirement: { isRequired: false, details: null },
                  orientationRequirement: { isRequired: false, details: null },
                  pricing: { isPaid: false, details: null },
                  otherDetails: 'Bring ID',
                },
                audience: {
                  admissionPolicy: 'restricted',
                  isTargeted: false,
                  description: 'Adults only',
                  ageRange: { min: 18, max: 65 },
                  administrativeStatuses: 'refugee',
                  familyStatuses: 'isolated',
                  otherStatuses: 'student',
                  genders: 'women',
                  specialSupportContexts: [
                    {
                      type: 'humanitarianCrisis',
                      key: 'ukraine',
                      label: 'Ukraine support',
                      details: 'Dedicated volunteers',
                    },
                  ],
                },
                schedule: {
                  weeklySchedule: [
                    {
                      dayOfWeek: 'monday',
                      status: 'open',
                      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
                    },
                  ],
                  publicHolidays: {
                    status: 'specific',
                    openedHolidays: [
                      { label: 'New Year', status: 'open', timeSlots: [] },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        v20260303: {
          legacyById: new Map([
            [
              '123',
              {
                services_all: [
                  {
                    serviceObjectId: 'service_1',
                    createdAt: '2025-12-24T00:00:00.000Z',
                    modalities: { docs: ['legacy-doc'] },
                    publics: { accueil: 1 },
                    hours: { closedHolidays: PlaceClosedHolidays.CLOSED },
                  },
                ],
              },
            ],
          ]),
        },
      },
    );

    const service = (downgraded as { places: Array<Record<string, unknown>> })
      .places[0].services_all as Array<Record<string, unknown>>;

    expect(service[0]).toMatchObject({
      createdAt: '2025-12-24T00:00:00.000Z',
      serviceObjectId: 'service_1',
      saturated: {
        status: ServiceSaturation.HIGH,
      },
      modalities: {
        docs: ['legacy-doc'],
        appointment: { checked: true, precisions: 'Call before' },
      },
      publics: {
        accueil: 1,
      },
      hours: {
        closedHolidays: PlaceClosedHolidays.OPEN,
      },
    });
  });

  it('merges temporary information arrays into legacy single-slot tempInfos', async () => {
    const compiled = new DslCompiler().compileResponseChange(
      new ReplaceTempInfosByTemporaryInformation(),
    );

    const downgraded = await compiled.downgrade({
      places: [
        {
          temporaryInformation: {
            closures: [
              {
                startDate: '2026-05-02T00:00:00.000Z',
                endDate: '2026-05-03T00:00:00.000Z',
                description: 'Closure A',
              },
              {
                startDate: '2026-05-01T00:00:00.000Z',
                endDate: '2026-05-05T00:00:00.000Z',
                description: 'Closure B',
              },
            ],
            scheduleAdjustments: [
              {
                startDate: '2026-06-10T00:00:00.000Z',
                endDate: '2026-06-11T00:00:00.000Z',
                description: 'Reduced hours',
                schedule: {
                  weeklySchedule: [
                    {
                      dayOfWeek: 'monday',
                      status: 'open',
                      timeSlots: [{ startTime: '10:00', endTime: '14:00' }],
                    },
                  ],
                  publicHolidays: { status: 'unknown', openedHolidays: [] },
                },
              },
              {
                startDate: '2026-06-12T00:00:00.000Z',
                endDate: '2026-06-15T00:00:00.000Z',
                description: 'Second adjustment',
                schedule: {
                  weeklySchedule: [],
                  publicHolidays: { status: 'unknown', openedHolidays: [] },
                },
              },
            ],
            messages: [
              {
                title: 'Info 1',
                startDate: '2026-07-01T00:00:00.000Z',
                endDate: '2026-07-02T00:00:00.000Z',
                description: 'Message A',
              },
              {
                title: 'Info 2',
                startDate: '2026-07-03T00:00:00.000Z',
                endDate: '2026-07-10T00:00:00.000Z',
                description: 'Message B',
              },
            ],
          },
        },
      ],
    });

    const tempInfos = (downgraded as { places: Array<Record<string, unknown>> })
      .places[0].tempInfos as Record<string, unknown>;

    expect(tempInfos.closure).toMatchObject({
      dateDebut: '2026-05-01T00:00:00.000Z',
      dateFin: '2026-05-05T00:00:00.000Z',
    });
    expect(
      (tempInfos.closure as { description: string }).description,
    ).toContain('Closure A');
    expect(
      (tempInfos.hours as { hours: Record<string, unknown> }).hours,
    ).toMatchObject({
      monday: {
        timeslot: [{ start: 1000, end: 1400 }],
      },
    });
    expect(tempInfos.message).toMatchObject({
      name: 'Info 1 | Info 2',
      dateDebut: '2026-07-01T00:00:00.000Z',
      dateFin: '2026-07-10T00:00:00.000Z',
    });
  });

  it('falls back to legacy tempInfos lookup when canonical temporaryInformation is empty', async () => {
    const compiled = new DslCompiler().compileResponseChange(
      new ReplaceTempInfosByTemporaryInformation(),
    );

    const downgraded = await compiled.downgrade(
      {
        places: [
          {
            id: 'legacy-temp',
            temporaryInformation: {
              closures: [],
              scheduleAdjustments: [],
              messages: [],
            },
          },
        ],
      },
      {
        v20260303: {
          legacyById: new Map([
            [
              'legacy-temp',
              {
                tempInfos: {
                  closure: { actif: true, description: 'Legacy closure' },
                },
              },
            ],
          ]),
        },
      },
    );

    expect(
      (
        (downgraded as { places: Array<Record<string, unknown>> }).places[0]
          .tempInfos as { closure?: { description?: string } }
      ).closure?.description,
    ).toBe('Legacy closure');
  });

  it('maps place-level access and audience with deterministic legacy fallbacks', async () => {
    const compiler = new DslCompiler();
    const accessDowngrade = compiler.compileResponseChange(
      new ReplaceModalitiesByAccess(),
    );
    const audienceDowngrade = compiler.compileResponseChange(
      new ReplacePublicsByAudience(),
    );

    const withModalities = await accessDowngrade.downgrade(
      {
        places: [
          {
            id: 'lookup',
            access: {
              isUnconditional: true,
              allowPets: false,
              isWheelchairAccessible: true,
              appointmentRequirement: { isRequired: false, details: null },
              registrationRequirement: { isRequired: false, details: null },
              orientationRequirement: { isRequired: false, details: null },
              pricing: { isPaid: true, details: '2€' },
              otherDetails: 'Other details',
            },
          },
        ],
      },
      {
        v20260303: {
          legacyById: new Map([
            [
              'lookup',
              {
                modalities: {
                  docs: ['id-document'],
                },
              },
            ],
          ]),
        },
      },
    );

    const withPublics = await audienceDowngrade.downgrade(
      {
        places: [
          {
            id: 'lookup',
            audience: {
              admissionPolicy: 'restricted',
              isTargeted: false,
              description: 'General info',
              ageRange: null,
              administrativeStatuses: 'regular',
              familyStatuses: 'family',
              otherStatuses: 'violence',
              genders: 'men',
              specialSupportContexts: [
                {
                  type: 'humanitarianCrisis',
                  key: 'flood',
                  label: 'Flood support',
                  details: 'Emergency desk',
                },
              ],
            },
          },
        ],
      },
      {
        v20260303: {
          legacyById: new Map([
            [
              'lookup',
              {
                publics: {
                  accueil: 1,
                },
              },
            ],
          ]),
        },
      },
    );

    expect(
      (withModalities as { places: Array<Record<string, unknown>> }).places[0]
        .modalities,
    ).toMatchObject({
      docs: ['id-document'],
      price: { checked: true, precisions: '2€' },
    });

    expect(
      (withPublics as { places: Array<Record<string, unknown>> }).places[0]
        .publics,
    ).toMatchObject({
      accueil: 1,
    });
    expect(
      (
        (withPublics as { places: Array<Record<string, unknown>> }).places[0]
          .publics as { description: string }
      ).description,
    ).toContain('Special support contexts: Flood support: Emergency desk');
  });

  it('derives legacy itinerary show flag and holiday enum from discriminated schedule', async () => {
    const compiled = new DslCompiler().compileResponseChange(
      new ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches(),
    );

    const downgraded = await compiled.downgrade(
      {
        places: [
          {
            id: 'itinerary-id',
            type: 'itinerary',
            stops: [
              {
                description: null,
                location: {
                  address: '10 rue Example',
                  additionalInformation: '',
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
                    coordinates: [2.35, 48.85],
                  },
                },
                schedule: {
                  weeklySchedule: [
                    {
                      dayOfWeek: 'monday',
                      status: 'closed',
                      timeSlots: [],
                    },
                  ],
                  publicHolidays: {
                    status: 'specific',
                    openedHolidays: [
                      {
                        label: 'Bastille Day',
                        status: 'open',
                        timeSlots: [],
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        v20260303: {
          legacyById: new Map([
            [
              'itinerary-id',
              {
                parcours: [{ show: true }],
              },
            ],
          ]),
        },
      },
    );

    const stop = (
      (downgraded as { places: Array<Record<string, unknown>> }).places[0]
        .parcours as Array<Record<string, unknown>>
    )[0];

    expect(stop.show).toBe(true);
    expect(
      (stop.hours as { closedHolidays: PlaceClosedHolidays }).closedHolidays,
    ).toBe(PlaceClosedHolidays.OPEN);
  });
});
