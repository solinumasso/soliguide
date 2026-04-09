export interface SearchTimeSlot {
  startTime: string;
  endTime: string;
}

export interface SearchScheduleDay {
  dayOfWeek:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  status: 'open' | 'closed' | 'unknown';
  timeSlots: SearchTimeSlot[];
}

export interface SearchPublicHolidayRule {
  label: string;
  status: 'open' | 'closed';
  timeSlots: SearchTimeSlot[];
}

export interface SearchSchedule {
  weeklySchedule: SearchScheduleDay[];
  publicHolidays: {
    status: 'open' | 'closed' | 'unknown' | 'specific';
    openedHolidays: SearchPublicHolidayRule[];
  };
}

export interface SearchAccessRequirement {
  isRequired: boolean;
  details: string | null;
}

export interface SearchAccess {
  isUnconditional: boolean;
  allowPets: boolean;
  isWheelchairAccessible: boolean;
  appointmentRequirement: SearchAccessRequirement;
  registrationRequirement: SearchAccessRequirement;
  orientationRequirement: SearchAccessRequirement;
  pricing: {
    isPaid: boolean;
    details: string | null;
  };
  otherDetails: string | null;
}

export interface SearchSpecialSupportContext {
  type: string;
  key: string;
  label: string;
  details: string;
}

export interface SearchAudience {
  admissionPolicy: 'open' | 'restricted';
  isTargeted: boolean;
  description: string;
  ageRange: {
    min: number;
    max: number;
  } | null;
  administrativeStatuses: 'regular' | 'asylum' | 'refugee' | 'undocumented';
  familyStatuses: 'isolated' | 'family' | 'couple' | 'pregnant';
  otherStatuses:
    | 'violence'
    | 'addiction'
    | 'disability'
    | 'lgbt+'
    | 'hiv'
    | 'prostitution'
    | 'prison'
    | 'student';
  genders: 'men' | 'women';
  specialSupportContexts: SearchSpecialSupportContext[];
}

export type SearchContact =
  | {
      type: 'email';
      label: string;
      value: string;
    }
  | {
      type: 'phone';
      label: string;
      value: string;
    }
  | {
      type: 'fax';
      label: string;
      value: string;
    }
  | {
      type: 'website';
      label: string;
      value: string;
    }
  | {
      type: 'social';
      platform: string;
      label: string;
      value: string;
    };

export interface SearchLocation {
  address: string;
  additionalInformation: string;
  postalCode: string;
  city: string;
  country: string;
  timeZone: string;
  department: string;
  departmentCode: string;
  region: string;
  regionCode: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface SearchTemporaryClosure {
  startDate: string;
  endDate: string;
  description: string;
}

export interface SearchTemporaryScheduleAdjustment {
  startDate: string;
  endDate: string;
  description: string;
  schedule: SearchSchedule;
}

export interface SearchTemporaryMessage {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SearchTemporaryInformation {
  closures: SearchTemporaryClosure[];
  scheduleAdjustments: SearchTemporaryScheduleAdjustment[];
  messages: SearchTemporaryMessage[];
}

export interface SearchServiceItem {
  id: string;
  category: string;
  description: string;
  saturation: {
    level: 'low' | 'high';
    details: string | null;
  };
  isOpenToday: boolean;
  access: SearchAccess | null;
  audience: SearchAudience | null;
  schedule: SearchSchedule | null;
}

export interface SearchResultBase {
  id: string;
  name: string;
  description: string;
  slug: string;
  languages: string[];
  contact: SearchContact[];
  access: SearchAccess;
  audience: SearchAudience;
  temporaryInformation: SearchTemporaryInformation;
  services: SearchServiceItem[];
  isOpenToday: boolean;
  updatedAt: string;
}

export interface SearchFixedLocationResult extends SearchResultBase {
  type: 'fixedLocation';
  location: SearchLocation;
  schedule: SearchSchedule;
}

export interface SearchItineraryStop {
  description: string | null;
  location: SearchLocation;
  schedule: SearchSchedule;
}

export interface SearchItineraryResult extends SearchResultBase {
  type: 'itinerary';
  stops: SearchItineraryStop[];
}

export type SearchResult = SearchFixedLocationResult | SearchItineraryResult;

export interface SearchResponse {
  results: SearchResult[];
  nbResults: number;
  // page: {
  //   current: number;
  //   limit: number;
  //   totalPages: number;
  //   totalResults: number;
  // };
}
