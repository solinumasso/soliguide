import {
  Categories,
  GeoTypes,
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  ServiceSaturation,
} from "@soliguide/common";

export type LegacyDate = Date | string;

export interface SearchPosition {
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
  country?: string;
  timeZone?: string;
  adresse?: string;
  codePostal?: string;
  complementAdresse?: string;
  departement?: string;
  pays?: string;
  ville?: string;
  [key: string]: unknown;
}

export interface SearchPhoto {
  _id?: string;
  encoding?: string;
  filename: string;
  mimetype: string;
  parcours_id?: number;
  path: string;
  lieu_id: number;
  size?: number;
  createdAt?: LegacyDate;
  updatedAt?: LegacyDate;
  [key: string]: unknown;
}

export interface SearchTimeslot {
  end?: number | null;
  start?: number | null;
  [key: string]: unknown;
}

export interface SearchDayOpeningHours {
  open?: boolean;
  timeslot?: SearchTimeslot[];
  [key: string]: unknown;
}

export interface SearchOpeningHours {
  closedHolidays?: PlaceClosedHolidays;
  description?: string | null;
  monday?: SearchDayOpeningHours;
  tuesday?: SearchDayOpeningHours;
  wednesday?: SearchDayOpeningHours;
  thursday?: SearchDayOpeningHours;
  friday?: SearchDayOpeningHours;
  saturday?: SearchDayOpeningHours;
  sunday?: SearchDayOpeningHours;
  [key: string]: unknown;
}

export interface SearchModalitiesCheck {
  checked?: boolean;
  precisions?: string | null;
  [key: string]: unknown;
}

export interface SearchModalities {
  inconditionnel?: boolean;
  appointment?: SearchModalitiesCheck;
  inscription?: SearchModalitiesCheck;
  orientation?: SearchModalitiesCheck;
  price?: SearchModalitiesCheck;
  animal?: { checked?: boolean };
  pmr?: { checked?: boolean };
  docs?: string[];
  other?: string | null;
  [key: string]: unknown;
}

export interface SearchPublics {
  accueil?: 0 | 1 | 2;
  administrative?: string[];
  age?: { max?: number; min?: number };
  description?: string | null;
  familialle?: string[];
  gender?: string[];
  other?: string[];
  [key: string]: unknown;
}

export interface SearchCategorySpecificFields {
  activityName?: string;
  availableEquipmentPrecisions?: string;
  availableEquipmentType?: string[];
  babyParcelAgeType?: string[];
  canteensMealType?: string;
  courseType?: string;
  degreeOfChoiceType?: string;
  dietaryAdaptationsType?: string[];
  dietaryRegimesType?: string;
  domiciliationType?: string;
  foodProductType?: string[];
  otherProductTypePrecisions?: string;
  hygieneProductType?: string;
  jobsList?: string;
  nationalOriginProductType?: string;
  organicOriginProductType?: string;
  serviceStyleType?: string[];
  usageModality?: string;
  voucherType?: string;
  voucherTypePrecisions?: string;
  wellnessActivityName?: string;
  [key: string]: unknown;
}

export interface SearchService {
  categorie?: number;
  category: Categories;
  close?: {
    actif?: boolean;
    dateDebut?: LegacyDate | null;
    dateFin?: LegacyDate | null;
    closeType?: number | null;
  };
  description?: string | null;
  differentHours?: boolean;
  differentModalities?: boolean;
  differentPublics?: boolean;
  hours?: SearchOpeningHours;
  isOpenToday: boolean;
  modalities?: SearchModalities;
  publics?: SearchPublics;
  saturated?: {
    precision?: string | null;
    status?: ServiceSaturation;
  };
  serviceObjectId: string;
  createdAt: LegacyDate;
  categorySpecificFields?: SearchCategorySpecificFields;
  jobsList?: string | null;
  name?: string | null;
  [key: string]: unknown;
}

export interface SearchGeoZone {
  geoType?: GeoTypes | null;
  geoValue?: string;
  label?: string;
  [key: string]: unknown;
}

export interface SearchTempInfoBase {
  actif?: boolean;
  dateDebut?: LegacyDate | null;
  dateFin?: LegacyDate | null;
  description?: string;
  [key: string]: unknown;
}

export interface SearchTempInfo {
  closure?: SearchTempInfoBase;
  hours?: SearchTempInfoBase & { hours?: SearchOpeningHours | null };
  message?: SearchTempInfoBase & { name?: string };
  [key: string]: unknown;
}

export interface SearchSourceId {
  id: string;
  url?: string;
  [key: string]: unknown;
}

export interface SearchSource {
  ids?: SearchSourceId[];
  isOrigin: boolean;
  license?: string;
  name: string;
  [key: string]: unknown;
}

export interface SearchParcours {
  description?: string | null;
  hours?: SearchOpeningHours;
  position?: SearchPosition | null;
  photos?: SearchPhoto[];
  show?: boolean;
  [key: string]: unknown;
}

export interface SearchPhone {
  label?: string | null;
  phoneNumber?: string | null;
  countryCode?: string;
  isSpecialPhoneNumber?: boolean;
  [key: string]: unknown;
}

export interface SearchEntity {
  facebook?: string;
  fax?: string;
  instagram?: string;
  mail?: string;
  name?: string | null;
  phones?: SearchPhone[];
  website?: string | null;
  [key: string]: unknown;
}

export interface SearchSlugs {
  infos?: {
    description?: string | null;
    name?: string | null;
  };
  [key: string]: unknown;
}

export interface SearchPlace {
  lieu_id?: number;
  _id?: string;
  seo_url?: string;
  name?: string;
  description?: string | null;
  status?: PlaceStatus;
  visibility?: PlaceVisibility;
  isOpenToday?: boolean;
  close?: boolean;
  photos?: SearchPhoto[];
  placeType?: PlaceType;
  services_all?: SearchService[];
  position?: SearchPosition;
  parcours?: SearchParcours[];
  entity?: SearchEntity;
  geoZones?: SearchGeoZone[];
  newhours?: SearchOpeningHours;
  modalities?: SearchModalities;
  publics?: SearchPublics;
  sourceLanguage?: string;
  country?: string;
  languages?: string[];
  createdAt?: LegacyDate;
  updatedAt?: LegacyDate;
  updatedByUserAt?: LegacyDate;
  tempInfos?: SearchTempInfo;
  sources?: SearchSource[];
  slugs?: SearchSlugs;
  distance?: number;
  [key: string]: unknown;
}

export interface SearchResult {
  nbResults: number;
  places: SearchPlace[];
}
