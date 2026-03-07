import {
  AnyDepartmentCode,
  AnyRegionCode,
  AnyTimeZone,
  CountryCodes,
} from "../../../location";

export interface PostgresPosition {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  city_code: string;
  postal_code: string;
  country: CountryCodes;
  region: string;
  region_code: AnyRegionCode;
  department: string;
  department_code: AnyDepartmentCode;
  time_zone: AnyTimeZone;
  additional_information?: string;
}
