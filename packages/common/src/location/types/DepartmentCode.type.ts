import {
  AD_DEPARTMENT_CODES,
  ES_DEPARTMENT_CODES,
  FR_DEPARTMENT_CODES,
} from "../constants";

export interface DepartmentCodeMappings {
  fr: (typeof FR_DEPARTMENT_CODES)[number];
  es: (typeof ES_DEPARTMENT_CODES)[number];
  ad: (typeof AD_DEPARTMENT_CODES)[number];
}

export type DepartmentCode<CountryCode extends keyof DepartmentCodeMappings> =
  DepartmentCodeMappings[CountryCode];

export type AnyDepartmentCode =
  DepartmentCodeMappings[keyof DepartmentCodeMappings];
