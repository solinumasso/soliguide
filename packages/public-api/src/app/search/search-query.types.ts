import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from '@soliguide/common';

export type SearchAccessMode = 'appointment' | 'registration' | 'orientation';

export type SearchAdministrativeStatus = Exclude<
  `${PublicsAdministrative}`,
  'all'
>;

export type SearchFamilySituation = Exclude<`${PublicsFamily}`, 'all'>;

export type SearchGender = Exclude<`${PublicsGender}`, 'all'>;

export type SearchAudienceCharacteristic = Exclude<`${PublicsOther}`, 'all'>;

export interface SearchQueryLocation {
  country?: string;
  administrativeDivision?: {
    regionCode?: string;
    region?: string;
    departmentCode?: string;
    department?: string;
  };
  city?: {
    type?: 'city' | 'postalCode';
    value?: string;
  };
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  radiusKm?: number;
}

export interface SearchQueryAccess {
  kind?: 'unconditional' | 'conditional';
  modes?: SearchAccessMode[];
}

export interface SearchQueryAudience {
  admissionPolicy?: 'open' | 'restricted';
  isTargeted?: boolean;
  administrativeStatuses?: SearchAdministrativeStatus[];
  age?: {
    min?: number;
    max?: number;
  };
  familySituations?: SearchFamilySituation[];
  genders?: SearchGender[];
  otherCharacteristics?: SearchAudienceCharacteristic[];
}

export interface SearchQueryUpdatedAt {
  on?: string;
  before?: string;
  after?: string;
}

export interface SearchQuery {
  q?: string;
  language?: string;
  categories?: string[];
  location?: SearchQueryLocation;
  availability?: {
    openToday?: boolean;
  };
  access?: SearchQueryAccess;
  audience?: SearchQueryAudience;
  updatedAt?: SearchQueryUpdatedAt;
  pagination?: {
    page?: number;
    limit?: number;
  };
}
