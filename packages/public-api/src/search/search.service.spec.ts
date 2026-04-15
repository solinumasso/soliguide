import {
  Categories,
  GeoTypes,
  PlaceStatus,
  PlaceVisibility,
  PlaceType,
  UserStatus,
  UserStatusNotLogged,
  CountryCodes,
} from "@soliguide/common";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { SearchUserContext } from "./auth/search-auth.resolver";
import { V20260101SearchRequest } from "../versions/2026-01-01/2026-01-01.search-request.schema.generated";
import { NonAdminUserStatus } from "./search-query/search-query";
import { SearchService } from "./search.service";
import { PlacesRepository } from "./repositories/places.repository";

describe("SearchService", () => {
  const placesRepository: Mocked<PlacesRepository> = {
    search: vi.fn().mockResolvedValue({ nbResults: 0, places: [] }),
  } as unknown as Mocked<PlacesRepository>;

  const sut = new SearchService(placesRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    UserStatus.PRO,
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
    UserStatus.WIDGET_USER,
    UserStatus.API_USER,
    UserStatus.SOLI_BOT,
    UserStatusNotLogged.NOT_LOGGED,
  ] satisfies NonAdminUserStatus[])(
    "enforces ONLINE status for all non-admin statuses",
    async (status: NonAdminUserStatus) => {
      await sut.search(buildRequest(), buildUserContext({ status }));

      expect(placesRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PlaceStatus.ONLINE,
        }),
        { page: 1, limit: 100 }
      );
    }
  );

  it.each([
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
    UserStatus.WIDGET_USER,
    UserStatus.API_USER,
    UserStatus.SOLI_BOT,
    UserStatusNotLogged.NOT_LOGGED,
  ] satisfies NonAdminUserStatus[])(
    "enforces ALL visibility for %s",
    async (status: NonAdminUserStatus) => {
      await sut.search(buildRequest(), buildUserContext({ status }));

      expect(placesRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          visibility: PlaceVisibility.ALL,
        }),
        { page: 1, limit: 100 }
      );
    }
  );

  it("does not force ALL visibility for PRO", async () => {
    await sut.search(
      buildRequest(),
      buildUserContext({ status: UserStatus.PRO })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        visibility: undefined,
      }),
      { page: 1, limit: 100 }
    );
  });

  it.each([
    UserStatus.API_USER,
    UserStatus.WIDGET_USER,
    UserStatus.SOLI_BOT,
  ] satisfies NonAdminUserStatus[])(
    "keeps all requested categories for API_USER, WIDGET_USER and SOLI_BOT",
    async (status: NonAdminUserStatus) => {
      const requestedCategories = [
        Categories.FOOD_DISTRIBUTION,
        Categories.DOMICILIATION,
      ];

      await sut.search(
        buildRequest({
          categories: requestedCategories,
        }),
        buildUserContext({ status })
      );

      expect(placesRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: requestedCategories,
        }),
        { page: 1, limit: 100 }
      );
    }
  );

  it.each([
    UserStatus.PRO,
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
  ] satisfies NonAdminUserStatus[])(
    "keeps only first category for PRO, SIMPLE_USER and VOLUNTEER when categories[] is provided",
    async (status: NonAdminUserStatus) => {
      const requestedCategories = [
        Categories.FOOD_DISTRIBUTION,
        Categories.DOMICILIATION,
      ];

      await sut.search(
        buildRequest({
          categories: requestedCategories,
        }),
        buildUserContext({ status })
      );

      expect(placesRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: [Categories.FOOD_DISTRIBUTION],
        }),
        { page: 1, limit: 100 }
      );
    }
  );

  it("intersects API_USER categories with categoriesLimitations", async () => {
    await sut.search(
      buildRequest({
        categories: [Categories.FOOD_DISTRIBUTION, Categories.DOMICILIATION],
      }),
      buildUserContext({
        status: UserStatus.API_USER,
        categoriesLimitations: [Categories.DOMICILIATION],
      })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [Categories.DOMICILIATION],
      }),
      { page: 1, limit: 100 }
    );
  });

  it("uses API_USER categoriesLimitations when categories are not provided", async () => {
    await sut.search(
      buildRequest(),
      buildUserContext({
        status: UserStatus.API_USER,
        categoriesLimitations: [
          Categories.DOMICILIATION,
          Categories.HYGIENE_AND_WELLNESS,
        ],
      })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [Categories.DOMICILIATION, Categories.HYGIENE_AND_WELLNESS],
      }),
      { page: 1, limit: 100 }
    );
  });

  it("forwards search query factory output to repository pipeline", async () => {
    const createSpy = vi.spyOn(
      (
        sut as unknown as {
          searchQueryFactory: {
            create: (request: V20260101SearchRequest) => unknown;
          };
        }
      ).searchQueryFactory,
      "create"
    );
    createSpy.mockReturnValueOnce({
      placeType: PlaceType.PLACE,
      word: "food",
    });

    await sut.search(buildRequest(), buildUserContext());

    expect(createSpy).toHaveBeenCalledWith(buildRequest());
    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        word: "food",
        status: PlaceStatus.ONLINE,
      }),
      { page: 1, limit: 100 }
    );
  });

  it("converts API_USER legacy mobility single category to new taxonomy before query construction", async () => {
    await sut.search(
      buildRequest({
        category: "chauffeur_driven_transport" as unknown as Categories,
      }),
      buildUserContext({ status: UserStatus.API_USER })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [Categories.TRANSPORTATION_MOBILITY],
      }),
      { page: 1, limit: 100 }
    );
  });

  it("converts API_USER legacy mobility categories array to new taxonomy before query construction", async () => {
    await sut.search(
      buildRequest({
        categories: [
          "carpooling" as unknown as Categories,
          "provision_of_vehicles" as unknown as Categories,
          Categories.DOMICILIATION,
        ],
      }),
      buildUserContext({ status: UserStatus.API_USER })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [
          Categories.TRANSPORTATION_MOBILITY,
          Categories.PERSONAL_VEHICLE_ACCESS,
          Categories.DOMICILIATION,
        ],
      }),
      { page: 1, limit: 100 }
    );
  });

  it("adds API user territory restrictions from areas", async () => {
    await sut.search(
      buildRequest(),
      buildUserContext({
        status: UserStatus.API_USER,
        areas: { [CountryCodes.FR]: { departments: ["75", "93"] } },
      })
    );

    expect(placesRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        apiUserRestrictions: {
          $or: [
            {
              "position.departmentCode": { $in: ["75", "93"] },
              "position.country": "fr",
            },
            {
              "parcours.position.departmentCode": { $in: ["75", "93"] },
              "parcours.position.country": "fr",
            },
          ],
        },
      }),
      { page: 1, limit: 100 }
    );
  });

  it("defaults pagination to page=1 and limit=100 when options are missing", async () => {
    await sut.search(buildRequest(), buildUserContext());

    expect(placesRepository.search).toHaveBeenCalledWith(expect.any(Object), {
      page: 1,
      limit: 100,
    });
  });

  it("defaults limit to 20 when options exist without explicit limit", async () => {
    await sut.search(
      buildRequest({
        options: {
          page: 3,
        },
      }),
      buildUserContext()
    );

    expect(placesRepository.search).toHaveBeenCalledWith(expect.any(Object), {
      page: 3,
      limit: 20,
    });
  });
});

function buildRequest(
  overrides: Partial<V20260101SearchRequest> = {}
): V20260101SearchRequest {
  return {
    placeType: PlaceType.PLACE,
    location: {
      geoType: GeoTypes.POSITION,
      coordinates: [2.35, 48.85],
      country: "FR",
    },
    ...overrides,
  } as V20260101SearchRequest;
}

function buildUserContext(
  overrides: Partial<SearchUserContext> = {}
): SearchUserContext {
  return {
    userId: "user-1",
    status: UserStatus.SIMPLE_USER,
    ...overrides,
  };
}
