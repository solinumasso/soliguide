import {
  CountryCodes,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  UserStatus,
} from "@soliguide/common";
import { MongoClient, ObjectId } from "mongodb";

const PASSWORD_HASH =
  "$2a$04$xcd9UwD7CWCiGtlWH59CXeYv2jB3kdN/et8ThHAOsIGhJwcq59qXe";

const BASE_DATE = new Date("2026-01-15T10:00:00.000Z");
const PARIS_CENTER: [number, number] = [2.3525855, 48.8636338];

const ORGANIZATION_IDS = {
  alpha: objectIdFromNumber(10_001),
  beta: objectIdFromNumber(10_002),
};

const USER_IDS = {
  api: objectIdFromNumber(20_001),
  widget: objectIdFromNumber(20_002),
  simple: objectIdFromNumber(20_003),
  pro: objectIdFromNumber(20_004),
  soliBot: objectIdFromNumber(20_005),
  volunteer: objectIdFromNumber(20_006),
};

export async function seedCompatibilityDatabase(mongoUri: string): Promise<void> {
  const client = new MongoClient(mongoUri);
  await client.connect();

  try {
    const db = client.db("soliguide_test");
    await db.dropDatabase();

    const places = buildPlaces();
    const organizations = buildOrganizations(places);
    const users = buildUsers();

    await db.collection("lieux").insertMany(places);
    await db.collection("organization").insertMany(organizations);
    await db.collection("users").insertMany(users);
  } finally {
    await client.close();
  }
}

function buildUsers() {
  const now = BASE_DATE;

  return [
    {
      _id: USER_IDS.api,
      blocked: false,
      categoriesLimitations: [],
      devToken: null,
      invitations: [],
      languages: [],
      lastname: "Atlas",
      mail: "api.compat@soliguide.test",
      name: "Ari",
      organizations: [],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      selectedOrgaIndex: 0,
      status: UserStatus.API_USER,
      territories: ["75"],
      title: "",
      translator: false,
      user_id: 9001,
      verified: true,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      areas: {
        fr: {
          departments: ["75"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
    {
      _id: USER_IDS.widget,
      blocked: false,
      categoriesLimitations: [],
      devToken: null,
      invitations: [],
      languages: [],
      lastname: "Canvas",
      mail: "widget.compat@soliguide.test",
      name: "Willa",
      organizations: [],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      selectedOrgaIndex: 0,
      status: UserStatus.WIDGET_USER,
      territories: ["75"],
      title: null,
      translator: false,
      user_id: 9002,
      verified: true,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      areas: {
        fr: {
          departments: ["75"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
    {
      _id: USER_IDS.simple,
      blocked: false,
      devToken: null,
      invitations: [],
      languages: ["en"],
      organizations: [],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      roles: [],
      selectedOrgaIndex: 0,
      status: UserStatus.SIMPLE_USER,
      territories: [],
      title: null,
      translator: false,
      verified: true,
      mail: "simple.compat@soliguide.test",
      name: "Sami",
      lastname: "Plain",
      user_id: 9003,
      createdAt: now,
      updatedAt: now,
      verifiedAt: now,
      lastLogin: null,
    },
    {
      _id: USER_IDS.pro,
      blocked: false,
      devToken: null,
      invitations: [],
      languages: [],
      organizations: [ORGANIZATION_IDS.alpha],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      roles: [],
      selectedOrgaIndex: 0,
      status: UserStatus.PRO,
      territories: ["75"],
      title: "Compatibility editor",
      translator: false,
      verified: true,
      mail: "pro.compat@soliguide.test",
      name: "Pia",
      lastname: "Editor",
      user_id: 9004,
      createdAt: now,
      updatedAt: now,
      verifiedAt: now,
      areas: {
        fr: {
          departments: ["75"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
    {
      _id: USER_IDS.soliBot,
      blocked: false,
      categoriesLimitations: [],
      devToken: null,
      invitations: [],
      languages: [],
      lastname: "Crawler",
      mail: "solibot.compat@soliguide.test",
      name: "Soli",
      organizations: [],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      selectedOrgaIndex: 0,
      status: UserStatus.SOLI_BOT,
      territories: ["75", "78"],
      title: null,
      translator: false,
      user_id: 9005,
      verified: true,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
    },
    {
      _id: USER_IDS.volunteer,
      blocked: false,
      devToken: null,
      invitations: [],
      languages: [],
      organizations: [ORGANIZATION_IDS.beta],
      password: PASSWORD_HASH,
      passwordToken: null,
      phone: null,
      roles: [],
      selectedOrgaIndex: 0,
      status: UserStatus.VOLUNTEER,
      territories: ["78"],
      title: null,
      translator: false,
      verified: true,
      mail: "volunteer.compat@soliguide.test",
      name: "Vera",
      lastname: "Helper",
      user_id: 9006,
      createdAt: now,
      updatedAt: now,
      verifiedAt: now,
      areas: {
        fr: {
          departments: ["78"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
  ];
}

function buildOrganizations(
  places: Array<{ _id: ObjectId }>
) {
  const alphaPlaces = places.slice(0, 3).map((place) => place._id);
  const betaPlaces = places.slice(3, 5).map((place) => place._id);

  return [
    {
      _id: ORGANIZATION_IDS.alpha,
      organization_id: 7001,
      name: "Association Horizon Solidaire",
      createdAt: BASE_DATE,
      updatedAt: BASE_DATE,
      description:
        "Organisation fictive de test pour les parcours de compatibilite.",
      facebook: null,
      fax: null,
      mail: "contact@horizon-solidaire.test",
      phone: null,
      website: "https://horizon-solidaire.test",
      verified: {
        date: BASE_DATE,
        status: true,
      },
      invitations: [],
      users: [USER_IDS.pro],
      places: alphaPlaces,
      territories: ["75"],
      logo: null,
      counters: {
        invitations: {
          EDITOR: 0,
          OWNER: 0,
          READER: 0,
          TOTAL: 0,
        },
        users: {
          EDITOR: 1,
          OWNER: 0,
          READER: 0,
          TOTAL: 1,
        },
      },
      airtableId: "compat-org-alpha",
      priority: true,
      relations: ["ASSOCIATION"],
      areas: {
        fr: {
          departments: ["75"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
    {
      _id: ORGANIZATION_IDS.beta,
      organization_id: 7002,
      name: "Collectif Atelier Mobile",
      createdAt: BASE_DATE,
      updatedAt: BASE_DATE,
      description:
        "Deuxieme organisation fictive pour les scenarios de tests e2e.",
      facebook: null,
      fax: null,
      mail: "contact@atelier-mobile.test",
      phone: null,
      website: "https://atelier-mobile.test",
      verified: {
        date: BASE_DATE,
        status: true,
      },
      invitations: [],
      users: [USER_IDS.volunteer],
      places: betaPlaces,
      territories: ["78"],
      logo: null,
      counters: {
        invitations: {
          EDITOR: 0,
          OWNER: 0,
          READER: 0,
          TOTAL: 0,
        },
        users: {
          EDITOR: 0,
          OWNER: 1,
          READER: 0,
          TOTAL: 1,
        },
      },
      airtableId: "compat-org-beta",
      priority: false,
      relations: ["ASSOCIATION"],
      areas: {
        fr: {
          departments: ["78"],
          regions: [],
          cities: [],
        },
      },
      lastLogin: null,
    },
  ];
}

function buildPlaces() {
  const places: any[] = [];
  let sequence = 1;

  for (let index = 0; index < 40; index += 1) {
    const longitude = PARIS_CENTER[0] + ((index % 5) - 2) * 0.008;
    const latitude = PARIS_CENTER[1] + (Math.floor(index / 5) - 4) * 0.005;
    const category = pickCategory(index);
    const isOpenToday = index % 6 !== 0;

    places.push(
      createPlace({
        index: sequence++,
        name: `Maison Solidaire ${index + 1}`,
        seoSlug: `maison-solidaire-${index + 1}`,
        coordinates: [longitude, latitude],
        city: "Paris",
        postalCode: `750${(index % 9) + 1}`.padStart(5, "0"),
        department: "Paris",
        departmentCode: "75",
        region: "Ile-de-France",
        regionCode: "11",
        category,
        isOpenToday,
        visibility: PlaceVisibility.ALL,
        status: PlaceStatus.ONLINE,
        placeType: PlaceType.PLACE,
        priority: index % 7 === 0,
      })
    );
  }

  for (let index = 0; index < 4; index += 1) {
    places.push(
      createPlace({
        index: sequence++,
        name: `Lieu Hors Zone ${index + 1}`,
        seoSlug: `lieu-hors-zone-${index + 1}`,
        coordinates: [4.8357 + index * 0.01, 45.764 + index * 0.01],
        city: "Lyon",
        postalCode: "69001",
        department: "Rhone",
        departmentCode: "69",
        region: "Auvergne-Rhone-Alpes",
        regionCode: "84",
        category: "food_distribution",
        isOpenToday: true,
        visibility: PlaceVisibility.ALL,
        status: PlaceStatus.ONLINE,
        placeType: PlaceType.PLACE,
      })
    );
  }

  for (let index = 0; index < 3; index += 1) {
    places.push(
      createPlace({
        index: sequence++,
        name: `Lieu Brouillon ${index + 1}`,
        seoSlug: `lieu-brouillon-${index + 1}`,
        coordinates: [3.05 + index * 0.01, 50.63 + index * 0.01],
        city: "Lille",
        postalCode: "59000",
        department: "Nord",
        departmentCode: "59",
        region: "Hauts-de-France",
        regionCode: "32",
        category: "day_hosting",
        isOpenToday: true,
        visibility: PlaceVisibility.ALL,
        status: PlaceStatus.DRAFT,
        placeType: PlaceType.PLACE,
      })
    );
  }

  for (let index = 0; index < 3; index += 1) {
    places.push(
      createPlace({
        index: sequence++,
        name: `Parcours Mobile ${index + 1}`,
        seoSlug: `parcours-mobile-${index + 1}`,
        coordinates: [1.76 + index * 0.03, 48.80 + index * 0.01],
        city: "La Queue-les-Yvelines",
        postalCode: "78940",
        department: "Yvelines",
        departmentCode: "78",
        region: "Ile-de-France",
        regionCode: "11",
        category: "administrative_assistance",
        isOpenToday: true,
        visibility: PlaceVisibility.ALL,
        status: PlaceStatus.ONLINE,
        placeType: PlaceType.ITINERARY,
        parcoursCount: 3,
      })
    );
  }

  return places;
}

function createPlace(params: {
  index: number;
  name: string;
  seoSlug: string;
  coordinates: [number, number];
  city: string;
  postalCode: string;
  department: string;
  departmentCode: string;
  region: string;
  regionCode: string;
  category: string;
  isOpenToday: boolean;
  visibility: PlaceVisibility;
  status: PlaceStatus;
  placeType: PlaceType;
  priority?: boolean;
  parcoursCount?: number;
}) {
  const createdAt = new Date(BASE_DATE.getTime() - params.index * 86_400_000);
  const updatedAt = new Date(createdAt.getTime() + 3_600_000);
  const placeId = objectIdFromNumber(30_000 + params.index);
  const serviceId = objectIdFromNumber(40_000 + params.index);
  const basePosition = buildPosition({
    coordinates: params.coordinates,
    city: params.city,
    postalCode: params.postalCode,
    department: params.department,
    departmentCode: params.departmentCode,
    region: params.region,
    regionCode: params.regionCode,
    country: CountryCodes.FR,
    address: `${params.index} rue de la Compatibilite, ${params.postalCode} ${params.city}`,
  });

  return {
    _id: placeId,
    lieu_id: params.index,
    name: params.name,
    description: `Description fictive pour ${params.name}.`,
    entity: {
      facebook: null,
      fax: null,
      instagram: null,
      mail: `contact+${params.seoSlug}@soliguide.test`,
      name: null,
      phones: [
        {
          label: "Accueil",
          phoneNumber: `010203${String(params.index).padStart(4, "0")}`,
          countryCode: "fr",
          isSpecialPhoneNumber: false,
        },
      ],
      website: `https://${params.seoSlug}.soliguide.test`,
    },
    updatedAt,
    seo_url: `${params.seoSlug}-${params.index}`,
    services_all: [
      createService({
        serviceObjectId: serviceId,
        category: params.category,
        isOpenToday: params.isOpenToday,
        createdAt,
        name: `Service ${params.index}`,
      }),
    ],
    languages: ["fr"],
    close: {
      closeType: 0,
      dateDebut: null,
      dateFin: null,
      precision: "",
    },
    modalities: buildModalities(),
    publics: buildPublics(),
    stepsDone: {
      infos: true,
      emplacement: true,
      contacts: true,
      photos: true,
      horaires: true,
      publics: true,
      conditions: true,
      services: true,
    },
    newhours: buildHours(params.isOpenToday),
    photos: [],
    slugs: {
      infos: {
        name: params.name.toLowerCase(),
        description: `description fictive ${params.index}`,
      },
    },
    createdAt,
    tempInfos: {
      closure: {
        actif: false,
        dateDebut: null,
        dateFin: null,
        description: null,
      },
      hours: {
        actif: false,
        dateDebut: null,
        dateFin: null,
        description: null,
        hours: null,
      },
      message: {
        actif: false,
        dateDebut: null,
        dateFin: null,
        description: null,
        name: null,
      },
    },
    priority: Boolean(params.priority),
    placeType: params.placeType,
    position: basePosition,
    campaigns: {},
    geoZones: [],
    visibility: params.visibility,
    isOpenToday: params.isOpenToday,
    status: params.status,
    updatedByUserAt: updatedAt,
    createdBy: null,
    auto: false,
    parcours:
      params.placeType === PlaceType.ITINERARY
        ? buildParcours(basePosition, params.parcoursCount ?? 2)
        : [],
    country: CountryCodes.FR,
    sourceLanguage: "fr",
    migrated: true,
    sources: [],
  };
}

function createService(params: {
  serviceObjectId: ObjectId;
  category: string;
  isOpenToday: boolean;
  createdAt: Date;
  name: string;
}) {
  return {
    categorie: 100,
    category: params.category,
    close: {
      actif: false,
      dateDebut: null,
      dateFin: null,
    },
    description: "",
    differentHours: false,
    differentModalities: false,
    differentPublics: false,
    hours: buildHours(params.isOpenToday),
    isOpenToday: params.isOpenToday,
    modalities: buildModalities(),
    publics: buildPublics(),
    saturated: {
      precision: "",
      status: "LOW",
    },
    serviceObjectId: params.serviceObjectId,
    createdAt: params.createdAt,
    jobsList: "",
    name: params.name,
  };
}

function buildParcours(basePosition: ReturnType<typeof buildPosition>, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const longitude = basePosition.location.coordinates[0] + index * 0.012;
    const latitude = basePosition.location.coordinates[1] + index * 0.008;

    return {
      description: index === 0 ? null : "Sur rendez-vous",
      hours: buildHours(true),
      photos: [],
      position: buildPosition({
        coordinates: [longitude, latitude],
        city: index === 0 ? basePosition.city : `Etape ${index + 1}`,
        postalCode: basePosition.postalCode,
        department: basePosition.department,
        departmentCode: basePosition.departmentCode,
        region: normalizeRegion(basePosition.region),
        regionCode: basePosition.regionCode,
        country: CountryCodes.FR,
        address: `${12 + index} avenue de parcours, ${basePosition.postalCode} ${basePosition.city}`,
      }),
    };
  });
}

function buildPosition(params: {
  coordinates: [number, number];
  city: string;
  postalCode: string;
  department: string;
  departmentCode: string;
  region: string;
  regionCode: string;
  country: CountryCodes;
  address: string;
}) {
  const normalizedCity = slugify(params.city);
  const normalizedDepartment = slugify(params.department);
  const normalizedRegion = slugify(params.region);

  return {
    adresse: params.address,
    codePostal: params.postalCode,
    complementAdresse: null,
    departement: params.department,
    departementCode: params.departmentCode,
    location: {
      coordinates: params.coordinates,
      type: "Point",
    },
    pays: params.country,
    region: params.region,
    slugs: {
      ville: normalizedCity,
      departement: normalizedDepartment,
      pays: params.country,
      department: normalizedDepartment,
      country: params.country,
      region: normalizedRegion,
      city: normalizedCity,
    },
    ville: params.city,
    address: params.address,
    additionalInformation: "",
    city: params.city,
    postalCode: params.postalCode,
    cityCode: params.postalCode,
    department: params.department,
    departmentCode: params.departmentCode,
    country: params.country,
    regionCode: params.regionCode,
    timeZone: "Europe/Paris",
  };
}

function buildHours(isOpenToday: boolean) {
  return {
    closedHolidays: "UNKNOWN",
    description: "",
    monday: buildDay(isOpenToday),
    tuesday: buildDay(true),
    wednesday: buildDay(true),
    thursday: buildDay(true),
    friday: buildDay(true),
    saturday: buildDay(false),
    sunday: buildDay(false),
  };
}

function buildDay(open: boolean) {
  return {
    open,
    timeslot: open
      ? [
          {
            start: 900,
            end: 1700,
          },
        ]
      : [],
  };
}

function buildModalities() {
  return {
    inconditionnel: true,
    appointment: {
      checked: false,
      precisions: null,
    },
    inscription: {
      checked: false,
      precisions: null,
    },
    orientation: {
      checked: false,
      precisions: null,
    },
    price: {
      checked: false,
      precisions: null,
    },
    animal: {
      checked: false,
    },
    pmr: {
      checked: false,
    },
    docs: [],
    other: null,
  };
}

function buildPublics() {
  return {
    accueil: 1,
    administrative: ["regular", "asylum", "refugee", "undocumented"],
    age: {
      min: 18,
      max: 99,
    },
    description: null,
    familialle: ["isolated", "family", "couple", "pregnant"],
    gender: ["men", "women"],
    other: ["addiction", "handicap", "student"],
  };
}

function pickCategory(index: number): string {
  const categories = [
    "food_distribution",
    "food_packages",
    "day_hosting",
    "domiciliation",
    "general_practitioner",
    "clothing",
    "wifi",
    "electrical_outlets_available",
  ];

  return categories[index % categories.length];
}

function normalizeRegion(region: string): string {
  return region === "Ile-de-France" ? "Ile-de-France" : region;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function objectIdFromNumber(value: number): ObjectId {
  return new ObjectId(value.toString(16).padStart(24, "0"));
}
