import {
  Categories,
  CategoriesService,
  Themes,
  CountryAreaTerritories,
  CountryCodes,
  FR_DEPARTMENT_CODES,
  GeoTypes,
  PlaceSearchForAdmin,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  PublicsAdministrative,
  SearchFilterUpdatedAt,
  SearchPlaceStatus,
  UpdatedAtInterval,
  UserStatus,
  WelcomedPublics,
} from "@soliguide/common";

import { parseISO } from "date-fns";

import { generateSearchQuery } from "../query/generate-search-query";

import { ABSTRACT_USER } from "../../../../mocks/users/ABSTRACT_USER.mock";
import { getServiceCategoriesApi } from "../../../categories/functions/get-service-categories-api.function";

let categoryService: CategoriesService;

beforeAll(() => {
  categoryService = getServiceCategoriesApi(Themes.SOLIGUIDE_FR);
});

describe("Testing of the search query generation", () => {
  const user: any = {
    ...ABSTRACT_USER,
    ...{
      // Useless fields for generating the search query
      createdAt: new Date(),
      lastname: "",
      mail: "",
      name: "",
      phone: null,
      title: "",
      updatedAt: new Date(),
      user_id: 0,
      // Useful fields for generating the search query
      categoriesLimitations: [],
      status: UserStatus.SIMPLE_USER,
      territories: [],
      areas: {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["75"],
        }),
      },
      teritories: ["75"],
    },
  };

  describe("Unconnected user", () => {
    it("Search on Paris without anything", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.SIMPLE_USER;
      delete user.areas;

      const query = {
        location: {
          coordinates: [2.3310526, 48.8640493],
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        placeType: PlaceType.PLACE,
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $geoNear: {
          distanceField: "distance",
          key: "position.location",
          maxDistance: 20000,
          near: { coordinates: [2.3310526, 48.8640493], type: "Point" },
        },
        placeType: PlaceType.PLACE,
        services_all: {
          $elemMatch: {
            category: {
              $nin: [
                Categories.ADDICTION,
                Categories.TOILETS,
                Categories.WIFI,
                Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                Categories.FOUNTAIN,
              ],
            },
          },
        },
        "position.country": CountryCodes.FR,
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });

    it("Search a mobile service on Paris with a category and filters", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.SIMPLE_USER;
      user.areas = undefined;

      const query = {
        category: Categories.FOOD,
        location: {
          coordinates: [2.3310526, 48.8640493],
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        openToday: true,
        placeType: PlaceType.ITINERARY,
        publics: {
          administrative: [PublicsAdministrative.refugee],
        },
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $geoNear: {
          distanceField: "distance",
          key: "parcours.position.location",
          maxDistance: 20000,
          near: { coordinates: [2.3310526, 48.8640493], type: "Point" },
        },
        placeType: PlaceType.ITINERARY,
        services_all: {
          $elemMatch: {
            "publics.administrative": { $in: [PublicsAdministrative.refugee] },
            isOpenToday: true,
            category: {
              $in: [
                Categories.FOOD_DISTRIBUTION,
                Categories.FOOD_PACKAGES,
                Categories.BABY_PARCEL,
                Categories.FOOD_VOUCHER,
                Categories.SOCIAL_GROCERY_STORES,
                Categories.SHARED_KITCHEN,
                Categories.COOKING_WORKSHOP,
                Categories.COMMUNITY_GARDEN,
                Categories.SOLIDARITY_FRIDGE,
              ],
            },
          },
        },
        "parcours.position.country": CountryCodes.FR,
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });
  });

  describe("API user without limitation", () => {
    it("Search all services restricted to refugees and opened today on Paris", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.API_USER;
      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["75"],
        }),
      };

      const query = {
        location: {
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        openToday: true,
        placeType: PlaceType.PLACE,
        publics: {
          accueil: WelcomedPublics.EXCLUSIVE,
          administrative: [PublicsAdministrative.refugee],
        },
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $or: [
          {
            services_all: {
              $elemMatch: {
                "publics.accueil": 2,
                "publics.administrative": {
                  $in: [PublicsAdministrative.refugee],
                },
                isOpenToday: true,
                category: {
                  $nin: [
                    Categories.ADDICTION,
                    Categories.TOILETS,
                    Categories.WIFI,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                    Categories.FOUNTAIN,
                  ],
                },
              },
            },
          },
          {
            $and: [
              { "publics.accueil": 2 },
              {
                "publics.administrative": {
                  $in: [PublicsAdministrative.refugee],
                },
              },
              { isOpenToday: true },
              {
                services_all: {
                  $elemMatch: {
                    category: {
                      $nin: [
                        Categories.ADDICTION,
                        Categories.TOILETS,
                        Categories.WIFI,
                        Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                        Categories.FOUNTAIN,
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
        placeType: PlaceType.PLACE,
        "position.slugs.city": "paris",
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });

    it("Search multiples categories restricted to refugees and opened today on Paris", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.API_USER;
      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["75"],
        }),
      };

      const query = {
        categories: [Categories.WELCOME, Categories.FOOD],
        location: {
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        openToday: true,
        placeType: PlaceType.PLACE,
        publics: {
          accueil: WelcomedPublics.EXCLUSIVE,
          administrative: [PublicsAdministrative.refugee],
        },
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        placeType: PlaceType.PLACE,
        "position.slugs.city": "paris",
        services_all: {
          $elemMatch: {
            "publics.accueil": 2,
            "publics.administrative": { $in: [PublicsAdministrative.refugee] },
            isOpenToday: true,
            category: {
              $in: [
                Categories.DAY_HOSTING,
                Categories.REST_AREA,
                Categories.BABYSITTING,
                Categories.FAMILY_AREA,
                Categories.INFORMATION_POINT,
                Categories.FOOD_DISTRIBUTION,
                Categories.FOOD_PACKAGES,
                Categories.BABY_PARCEL,
                Categories.FOOD_VOUCHER,
                Categories.SOCIAL_GROCERY_STORES,
                Categories.SHARED_KITCHEN,
                Categories.COOKING_WORKSHOP,
                Categories.COMMUNITY_GARDEN,
                Categories.SOLIDARITY_FRIDGE,
              ],
            },
          },
        },
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });
  });

  describe("API user with limitations on services and territories", () => {
    it("Search all services on Marseille", () => {
      user.categoriesLimitations = [
        Categories.INFORMATION_POINT,
        Categories.JOB_COACHING,
        Categories.DOMICILIATION,
        Categories.PARENT_ASSISTANCE,
      ];
      user.status = UserStatus.API_USER;
      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["13"],
        }),
      };
      const query = {
        location: {
          geoType: GeoTypes.CITY,
          geoValue: "marseille",
        },
        placeType: PlaceType.PLACE,
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        placeType: PlaceType.PLACE,
        "position.slugs.city": "marseille",
        services_all: {
          $elemMatch: {
            category: {
              $in: [
                Categories.INFORMATION_POINT,
                Categories.JOB_COACHING,
                Categories.DOMICILIATION,
                Categories.PARENT_ASSISTANCE,
              ],
            },
          },
        },
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });

    it("Search multiples services on Marseille", () => {
      user.categoriesLimitations = [
        Categories.INFORMATION_POINT,
        Categories.JOB_COACHING,
        Categories.DOMICILIATION,
        Categories.PARENT_ASSISTANCE,
      ];
      user.status = UserStatus.API_USER;

      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["13"],
        }),
      };
      const query = {
        categories: [
          Categories.INFORMATION_POINT,
          Categories.FOOD_DISTRIBUTION,
        ],
        location: {
          geoType: GeoTypes.CITY,
          geoValue: "marseille",
        },
        placeType: PlaceType.PLACE,
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        placeType: PlaceType.PLACE,
        "position.slugs.city": "marseille",
        services_all: {
          $elemMatch: {
            category: { $in: [Categories.INFORMATION_POINT] },
          },
        },
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      });
    });
  });

  describe("User pro", () => {
    it("Search all heathcare services around me", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.PRO;

      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["75"],
        }),
      };

      const query = {
        category: Categories.HEALTH,
        location: {
          coordinates: [2.333333, 48.866667],
          geoType: GeoTypes.POSITION,
        },
        placeType: PlaceType.PLACE,
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $geoNear: {
          distanceField: "distance",
          key: "position.location",
          maxDistance: 10000,
          near: { coordinates: [2.333333, 48.866667], type: "Point" },
        },
        placeType: PlaceType.PLACE,
        services_all: {
          $elemMatch: {
            category: {
              $in: [
                Categories.STD_TESTING,
                Categories.PSYCHOLOGICAL_SUPPORT,
                Categories.CHILD_CARE,
                Categories.GENERAL_PRACTITIONER,
                Categories.DENTAL_CARE,
                Categories.PREGNANCY_CARE,
                Categories.VACCINATION,
                Categories.INFIRMARY,
                Categories.VET_CARE,
                Categories.ALLERGOLOGY,
                Categories.CARDIOLOGY,
                Categories.DERMATOLOGY,
                Categories.ECHOGRAPHY,
                Categories.ENDOCRINOLOGY,
                Categories.GASTROENTEROLOGY,
                Categories.GYNECOLOGY,
                Categories.KINESITHERAPY,
                Categories.MAMMOGRAPHY,
                Categories.OPHTHALMOLOGY,
                Categories.OTORHINOLARYNGOLOGY,
                Categories.NUTRITION,
                Categories.PEDICURE,
                Categories.PHLEBOLOGY,
                Categories.PNEUMOLOGY,
                Categories.RADIOLOGY,
                Categories.RHEUMATOLOGY,
                Categories.UROLOGY,
                Categories.SPEECH_THERAPY,
                Categories.STOMATOLOGY,
                Categories.OSTEOPATHY,
                Categories.ACUPUNCTURE,
              ],
            },
          },
        },
        status: PlaceStatus.ONLINE,
        "position.country": CountryCodes.FR,
      });
    });
  });

  describe("Territories' administrator user", () => {
    it("Search all services opened for asylum seekers on the department on the manage", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.ADMIN_TERRITORY;
      user.areas = {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["33"],
        }),
      };

      const query = {
        location: {
          geoType: GeoTypes.DEPARTMENT,
          geoValue: "gironde",
        },
        placeType: PlaceType.PLACE,
        publics: {
          administrative: [PublicsAdministrative.asylum],
        },
        country: CountryCodes.FR,
      } as Partial<PlaceSearchForAdmin>;

      expect(
        generateSearchQuery(categoryService, query, user, true)
      ).toStrictEqual({
        $or: [
          {
            services_all: {
              $elemMatch: {
                "publics.administrative": {
                  $in: [PublicsAdministrative.asylum],
                },
              },
            },
          },
          { "publics.administrative": { $in: [PublicsAdministrative.asylum] } },
        ],
        placeType: PlaceType.PLACE,
        "position.country": CountryCodes.FR,
        "position.slugs.departement": "gironde",
        "position.departmentCode": {
          $in: ["33"],
        },
      });
    });
  });

  describe("Soliguide's administrators user", () => {
    it("Search all services on the default search", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.ADMIN_SOLIGUIDE;
      user.areas = undefined;

      const query = {
        location: {
          geoType: GeoTypes.COUNTRY,
          geoValue: "france",
        },
        country: CountryCodes.FR,
        placeType: PlaceType.PLACE,
      } as Partial<PlaceSearchForAdmin>;

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $or: [
          {
            services_all: {
              $elemMatch: {
                category: {
                  $nin: [
                    Categories.ADDICTION,
                    Categories.TOILETS,
                    Categories.WIFI,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                    Categories.FOUNTAIN,
                  ],
                },
              },
            },
          },
          {
            $or: [
              {
                services_all: {
                  $elemMatch: {
                    category: {
                      $nin: [
                        Categories.ADDICTION,
                        Categories.TOILETS,
                        Categories.WIFI,
                        Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                        Categories.FOUNTAIN,
                      ],
                    },
                  },
                },
              },
              { services_all: { $size: 0 } },
            ],
          },
        ],
        placeType: PlaceType.PLACE,
        "position.country": CountryCodes.FR,
      });
    });

    it("Search all services on the manage", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.ADMIN_SOLIGUIDE;

      const query = {
        location: {
          geoType: GeoTypes.COUNTRY,
          geoValue: "france",
        },
        placeType: PlaceType.PLACE,
        country: CountryCodes.FR,
      } as Partial<PlaceSearchForAdmin>;

      expect(
        generateSearchQuery(categoryService, query, user, true)
      ).toStrictEqual({
        placeType: PlaceType.PLACE,
        "position.country": CountryCodes.FR,
        "position.departmentCode": {
          $in: [...FR_DEPARTMENT_CODES],
        },
      });
    });

    it("Search all online and permanently closed services restricted to refugees on the manage", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.ADMIN_SOLIGUIDE;

      const query = {
        location: {
          geoType: GeoTypes.COUNTRY,
          geoValue: "france",
        },
        placeType: PlaceType.PLACE,
        publics: {
          accueil: WelcomedPublics.EXCLUSIVE,
          administrative: [PublicsAdministrative.refugee],
        },
        country: CountryCodes.FR,
        status: SearchPlaceStatus.ONLINE,
      } as Partial<PlaceSearchForAdmin>;

      expect(
        generateSearchQuery(categoryService, query, user, true)
      ).toStrictEqual({
        $or: [
          {
            services_all: {
              $elemMatch: {
                "publics.accueil": 2,
                "publics.administrative": {
                  $in: [PublicsAdministrative.refugee],
                },
              },
            },
          },
          {
            $and: [
              { "publics.accueil": 2 },
              {
                "publics.administrative": {
                  $in: [PublicsAdministrative.refugee],
                },
              },
            ],
          },
        ],
        placeType: PlaceType.PLACE,
        "position.country": CountryCodes.FR,
        "position.departmentCode": {
          $in: [...FR_DEPARTMENT_CODES],
        },
        status: SearchPlaceStatus.ONLINE,
      });
    });

    it("Search on Paris without updated the 2021-12-20", () => {
      user.categoriesLimitations = [];
      user.status = UserStatus.ADMIN_SOLIGUIDE;

      const updatedAtField: SearchFilterUpdatedAt = {
        intervalType: UpdatedAtInterval.SPECIFIC_DAY,
        value: new Date("2020-12-20"),
      };

      const query: any = {
        location: {
          coordinates: [2.3310526, 48.8640493],
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        placeType: PlaceType.PLACE,
        updatedByUserAt: updatedAtField,
      };

      // Find places by UpdatedAt
      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual({
        $geoNear: {
          distanceField: "distance",
          key: "position.location",
          maxDistance: 20000,
          near: { coordinates: [2.3310526, 48.8640493], type: "Point" },
        },
        $or: [
          {
            services_all: {
              $elemMatch: {
                category: {
                  $nin: [
                    Categories.ADDICTION,
                    Categories.TOILETS,
                    Categories.WIFI,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                    Categories.FOUNTAIN,
                  ],
                },
              },
            },
          },
          {
            $or: [
              {
                services_all: {
                  $elemMatch: {
                    category: {
                      $nin: [
                        Categories.ADDICTION,
                        Categories.TOILETS,
                        Categories.WIFI,
                        Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                        Categories.FOUNTAIN,
                      ],
                    },
                  },
                },
              },
              { services_all: { $size: 0 } },
            ],
          },
        ],
        placeType: PlaceType.PLACE,
        updatedByUserAt: {
          $gte: parseISO("2020-12-20T00:00:00.000Z"),
          $lte: parseISO("2020-12-20T23:59:59.999Z"),
        },
        "position.country": CountryCodes.FR,
      });
    });
  });
  describe("Widget user", () => {
    it("Search with specific criteria as a widget user", () => {
      user.status = UserStatus.WIDGET_USER;
      user.categoriesLimitations = [];

      const query: any = {
        location: {
          coordinates: [2.3310526, 48.8640493],
          geoType: GeoTypes.CITY,
          geoValue: "paris",
        },
        placeType: PlaceType.PLACE,
      };

      const expectedQueryResult = {
        placeType: PlaceType.PLACE,
        "position.slugs.city": "paris",
        services_all: {
          $elemMatch: {
            category: {
              $nin: [
                Categories.ADDICTION,
                Categories.TOILETS,
                Categories.WIFI,
                Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                Categories.FOUNTAIN,
              ],
            },
          },
        },
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
        "position.country": CountryCodes.FR,
      };

      expect(generateSearchQuery(categoryService, query, user)).toStrictEqual(
        expectedQueryResult
      );
    });
  });
});
