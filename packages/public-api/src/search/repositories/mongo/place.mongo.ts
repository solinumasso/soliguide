import type {
  Categories,
  CategoriesSpecificFields,
  GeoTypes,
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  ServiceSaturation,
  SoliguideCountries,
  CampaignPlaceAutonomy,
  CampaignSource,
  CampaignStatus,
} from "@soliguide/common";

export type MongoObjectIdLike = {
  toString(): string;
  toHexString?: () => string;
};

export type MongoLegacyDate = Date | string;

export type MongoPhoto = {
  _id?: string | MongoObjectIdLike;
  encoding?: string;
  filename: string;
  mimetype: string;
  parcours_id?: number;
  path: string;
  lieu_id: number;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MongoPhone = {
  label?: string | null;
  phoneNumber?: string | null;
  countryCode?: string;
  isSpecialPhoneNumber?: boolean;
};

export type MongoEntity = {
  facebook?: string;
  fax?: string;
  instagram?: string;
  mail?: string;
  name?: string | null;
  phones?: MongoPhone[];
  website?: string | null;
};

export type MongoGeoZone = {
  geoType?: GeoTypes | null;
  geoValue?: string;
  label?: string;
};

export type MongoTimeslot = {
  start?: number | null;
  end?: number | null;
};

export type MongoDayOpeningHours = {
  open?: boolean;
  timeslot?: MongoTimeslot[];
};

export type MongoOpeningHours = {
  closedHolidays?: PlaceClosedHolidays;
  description?: string | null;
  monday?: MongoDayOpeningHours;
  tuesday?: MongoDayOpeningHours;
  wednesday?: MongoDayOpeningHours;
  thursday?: MongoDayOpeningHours;
  friday?: MongoDayOpeningHours;
  saturday?: MongoDayOpeningHours;
  sunday?: MongoDayOpeningHours;
};

export type MongoPosition = {
  location?: {
    type?: "Point";
    coordinates?: number[];
  };
  address?: string;
  additionalInformation?: string;
  city?: string;
  cityCode?: string;
  postalCode?: string;
  department?: string;
  departmentCode?: string;
  region?: string;
  regionCode?: string;
  country?: SoliguideCountries;
  timeZone?: string;
  adresse?: string;
  codePostal?: string;
  complementAdresse?: string | null;
  departement?: string | null;
  pays?: string;
  ville?: string | null;
};

export type MongoModalitiesCheck = {
  checked?: boolean;
  precisions?: string | null;
};

export type MongoModalities = {
  inconditionnel?: boolean;
  appointment?: MongoModalitiesCheck;
  inscription?: MongoModalitiesCheck;
  orientation?: MongoModalitiesCheck;
  price?: MongoModalitiesCheck;
  animal?: { checked?: boolean };
  pmr?: { checked?: boolean };
  docs?: Array<string | MongoObjectIdLike>;
  other?: string | null;
};

export type MongoPublics = {
  accueil?: 0 | 1 | 2;
  administrative?: string[];
  age?: {
    min?: number;
    max?: number;
  };
  description?: string | null;
  familialle?: string[];
  gender?: string[];
  other?: string[];
};

export type MongoService = {
  categorie?: number;
  category: Categories;
  close?: {
    actif?: boolean;
    dateDebut?: Date | null;
    dateFin?: Date | null;
  };
  description?: string | null;
  differentHours?: boolean;
  differentModalities?: boolean;
  differentPublics?: boolean;
  hours?: MongoOpeningHours;
  isOpenToday: boolean;
  modalities?: MongoModalities;
  publics?: MongoPublics;
  saturated?: {
    status?: ServiceSaturation;
    precision?: string | null;
  };
  serviceObjectId: string | MongoObjectIdLike;
  createdAt: Date;
  categorySpecificFields?: CategoriesSpecificFields;
  jobsList?: string | null;
  name?: string | null;
};

export type MongoSourceId = {
  id: string | MongoObjectIdLike;
  url?: string;
};

export type MongoSource = {
  ids?: MongoSourceId[];
  isOrigin: boolean;
  license?: string;
  name: string;
};

export type MongoParcours = {
  description?: string | null;
  hours?: MongoOpeningHours;
  position?: MongoPosition | null;
  photos?: MongoPhoto[];
  show?: boolean;
};

export type MongoTempInfoBase = {
  actif?: boolean;
  dateDebut?: Date | null;
  dateFin?: Date | null;
  description?: string;
};

export type MongoTempInfo = {
  closure?: MongoTempInfoBase;
  hours?: MongoTempInfoBase & {
    hours?: MongoOpeningHours | null;
  };
  message?: MongoTempInfoBase & {
    name?: string;
  };
};

export type MongoPlaceUpdateCampaign = {
  autonomy?: CampaignPlaceAutonomy;
  currentStep?: number;
  general?: {
    changes?: boolean;
    endDate?: Date | null;
    startDate?: Date | null;
    updated?: boolean;
  };
  remindMeDate?: Date | null;
  sections?: {
    tempClosure?: {
      changes?: boolean;
      date?: Date | null;
      updated?: boolean;
    };
    hours?: {
      changes?: boolean;
      date?: Date | null;
      updated?: boolean;
    };
    services?: {
      changes?: boolean;
      date?: Date | null;
      updated?: boolean;
    };
    tempMessage?: {
      changes?: boolean;
      date?: Date | null;
      updated?: boolean;
    };
  };
  source?: CampaignSource | null;
  status?: CampaignStatus;
  toUpdate?: boolean;
};

export type MongoCampaigns = {
  MAJ_ETE_2022?: MongoPlaceUpdateCampaign;
  MAJ_ETE_2023?: MongoPlaceUpdateCampaign;
  MAJ_ETE_2024?: MongoPlaceUpdateCampaign;
  MAJ_HIVER_2022?: MongoPlaceUpdateCampaign;
  MAJ_HIVER_2023?: MongoPlaceUpdateCampaign;
  END_YEAR_2024?: MongoPlaceUpdateCampaign;
  MID_YEAR_2025?: MongoPlaceUpdateCampaign;
  END_YEAR_2025?: MongoPlaceUpdateCampaign;
  UKRAINE_2022?: {
    changes?: boolean;
    date?: Date | null;
    updated?: boolean;
  };
};

export type MongoPlaceSlugs = {
  infos?: {
    description?: string | null;
    name?: string | null;
  };
};

export type MongoPlace = {
  _id?: string | MongoObjectIdLike;
  auto?: boolean;
  campaigns?: MongoCampaigns;
  createdBy?: string | null;
  description?: string | null;
  entity?: MongoEntity;
  geoZones?: MongoGeoZone[];
  isOpenToday?: boolean;
  country?: SoliguideCountries;
  languages?: string[];
  lieu_id?: number;
  modalities?: MongoModalities;
  name?: string;
  newhours?: MongoOpeningHours;
  parcours?: MongoParcours[];
  photos?: MongoPhoto[];
  placeType?: PlaceType;
  position?: MongoPosition | null;
  priority?: boolean;
  publics?: MongoPublics;
  seo_url?: string;
  services_all?: MongoService[];
  slugs?: MongoPlaceSlugs;
  status?: PlaceStatus;
  stepsDone?: {
    conditions?: boolean;
    contacts?: boolean;
    emplacement?: boolean;
    horaires?: boolean;
    infos?: boolean;
    photos?: boolean;
    publics?: boolean;
    services?: boolean;
  };
  sources?: MongoSource[];
  tempInfos?: MongoTempInfo;
  updatedByUserAt?: Date;
  visibility?: PlaceVisibility;
  createdAt?: MongoLegacyDate;
  updatedAt?: MongoLegacyDate;
  distance?: number;
};
