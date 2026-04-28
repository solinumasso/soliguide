import {
  Categories,
  PlaceStatus,
  PlaceVisibility,
  PlaceType,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  UserStatus,
  UserStatusNotLogged,
  UpdatedAtInterval,
  CountryCodes,
  GeoTypes,
  OperationalAreas,
} from "@soliguide/common";

export type PositionSearchLocation = {
  geoType: GeoTypes.POSITION;
  coordinates: [number, number];
  distance?: number;
  country?: CountryCodes;
};

export type CountrySearchLocation = {
  geoType: GeoTypes.COUNTRY;
  country: CountryCodes;
};

export type CitySearchLocation = {
  geoType: GeoTypes.CITY;
  city: string;
  postalCode?: string;
};

export type BoroughSearchLocation = {
  geoType: GeoTypes.BOROUGH;
  postalCode: string;
};

export type DepartmentSearchLocation = {
  geoType: GeoTypes.DEPARTMENT;
  department: string;
};

export type RegionSearchLocation = {
  geoType: GeoTypes.REGION;
  region: string;
};

export type CitiesGroupSearchLocation = {
  geoType: GeoTypes.CITIES_GROUP;
  searchText: string;
};

export type UnknownSearchLocation = {
  geoType: GeoTypes.UNKNOWN;
  searchText: string;
};

export type SearchLocation =
  | PositionSearchLocation
  | CountrySearchLocation
  | CitySearchLocation
  | BoroughSearchLocation
  | DepartmentSearchLocation
  | RegionSearchLocation
  | CitiesGroupSearchLocation
  | UnknownSearchLocation;

export type SearchModalities = {
  isUnconditional?: boolean;
  isAppointmentRequired?: boolean;
  isRegistrationRequired?: boolean;
  isOrientationRequired?: boolean;
  hasWeelchairAccess?: boolean;
  isPaid?: boolean;
  acceptsPets?: boolean;
  sign?: boolean;
};

export type SearchAudiences = {
  admissionPolicy?: "open" | "restricted" | "targeted";
  age?: number;
  genders: PublicsGender[];
  administrativeStatuses: PublicsAdministrative[];
  familyStatuses: PublicsFamily[];
  otherStatuses: PublicsOther[];
};

export type SearchUpdatedAt = {
  intervalType?: UpdatedAtInterval;
  value?: Date | string | null;
};

export type SearchSortBy =
  | "createdAt"
  | "lieu_id"
  | "name"
  | "distance"
  | "slugs.infos.name"
  | "status"
  | "updatedAt";

export type SearchOptions = {
  sortBy?: SearchSortBy | null;
  sortValue?: 1 | -1 | null;
  page?: number | null;
  limit?: number | null;
  fields?: string | null;
};

export type NonAdminUserStatus =
  | UserStatus.API_USER
  | UserStatus.PRO
  | UserStatus.SIMPLE_USER
  | UserStatus.SOLI_BOT
  | UserStatus.VOLUNTEER
  | UserStatus.WIDGET_USER
  | UserStatusNotLogged.NOT_LOGGED;

export type SearchQuery = {
  locations?: SearchLocation[];
  categories?: Categories[];
  placeType?: PlaceType;
  word?: string;
  openToday?: boolean;
  modalities?: SearchModalities;
  audiences?: SearchAudiences;
  languages?: string[];
  widgetId?: string;
  updatedAt?: SearchUpdatedAt;
  options?: SearchOptions;
  status?: PlaceStatus;
  visibility?: PlaceVisibility;
  serviceFiltersEnabled?: boolean;
  apiUserRestrictions?: Record<string, unknown>;
};

export type SearchUserAreas = OperationalAreas;
