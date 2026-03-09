import { AD_TIMEZONES, ES_TIMEZONES, FR_TIMEZONES } from "../constants";

export interface TimeZoneMappings {
  fr: (typeof FR_TIMEZONES)[number];
  es: (typeof ES_TIMEZONES)[number];
  ad: (typeof AD_TIMEZONES)[number];
}

export type TimeZone<CountryCode extends keyof TimeZoneMappings> =
  TimeZoneMappings[CountryCode];

export type AnyTimeZone = TimeZoneMappings[keyof TimeZoneMappings];
