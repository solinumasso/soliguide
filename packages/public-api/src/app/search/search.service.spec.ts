import { SearchService } from './search.service';
import { type SearchQuery } from './search.types';
import { type PlaceSearchReader } from './ports/place-search-reader.port';
import { type SearchResultMapper } from './adapters/mongo/result-mapper/search-result.mapper';
import { type MongoPlaceDocument } from './adapters/mongo/place.mongo';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function getBaseQuery(overrides: Partial<SearchQuery> = {}): SearchQuery {
  return {
    locationMode: 'country',
    country: 'FR',
    ...overrides,
  };
}

describe('SearchService', () => {
  const searchRecord = { lieu_id: 42, name: 'Sample' } as MongoPlaceDocument;
  const mappedResult = {
    type: 'fixedLocation' as const,
    id: '42',
    name: 'Sample',
    description: '',
    slug: '',
    languages: [],
    contact: [],
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
      admissionPolicy: 'open' as const,
      isTargeted: false,
      description: '',
      ageRange: null,
      administrativeStatuses: 'regular' as const,
      familyStatuses: 'isolated' as const,
      otherStatuses: 'violence' as const,
      genders: 'men' as const,
      specialSupportContexts: [],
    },
    temporaryInformation: {
      closures: [],
      scheduleAdjustments: [],
      messages: [],
    },
    services: [],
    isOpenToday: false,
    updatedAt: '2026-03-26T10:15:00.000Z',
    location: {
      address: '',
      additionalInformation: '',
      postalCode: '',
      city: '',
      country: 'FR',
      timeZone: 'UTC',
      department: '',
      departmentCode: '',
      region: '',
      regionCode: '',
      location: {
        type: 'Point' as const,
        coordinates: [0, 0] as [number, number],
      },
    },
    schedule: {
      weeklySchedule: [],
      publicHolidays: { status: 'unknown' as const, openedHolidays: [] },
    },
  };

  const mockPlaceSearchReader: PlaceSearchReader = {
    search: vi.fn(),
  };

  const mockSearchResultMapper: Pick<SearchResultMapper, 'mapPlace'> = {
    mapPlace: vi.fn(),
  };

  const service = new SearchService(
    mockPlaceSearchReader,
    mockSearchResultMapper as SearchResultMapper,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockSearchResultMapper.mapPlace).mockReturnValue(mappedResult);
  });

  it('normalizes pagination, delegates search, and builds links', async () => {
    vi.mocked(mockPlaceSearchReader.search).mockResolvedValue({
      records: [searchRecord],
      totalResults: 25,
    });

    const response = await service.search(
      getBaseQuery({ page: 2, limit: 10, openToday: true }),
    );

    expect(mockPlaceSearchReader.search).toHaveBeenCalledWith(
      expect.objectContaining({
        locationMode: 'country',
        country: 'FR',
        openToday: true,
        page: 2,
        limit: 10,
      }),
      { page: 2, limit: 10 },
    );
    expect(mockSearchResultMapper.mapPlace).toHaveBeenCalledWith(searchRecord);
    expect(response.page).toEqual({
      current: 2,
      limit: 10,
      totalPages: 3,
      totalResults: 25,
    });
    expect(response._links.self.href).toContain('page=2');
    expect(response._links.next?.href).toContain('page=3');
    expect(response._links.prev?.href).toContain('page=1');
  });

  it('caps limit at max and keeps at least one total page', async () => {
    vi.mocked(mockPlaceSearchReader.search).mockResolvedValue({
      records: [],
      totalResults: 0,
    });

    const response = await service.search(getBaseQuery({ limit: 999 }));

    expect(mockPlaceSearchReader.search).toHaveBeenCalledWith(
      expect.any(Object),
      { page: 1, limit: 100 },
    );
    expect(response.page.totalPages).toBe(1);
    expect(response.results).toEqual([]);
  });
});
