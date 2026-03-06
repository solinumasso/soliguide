import { CountryCodes } from "../../location";
import { SupportedLanguagesCode } from "../../translations";

export interface PublicHoliday {
  isNational: boolean;
  name: string;
  departments: string[];
  startDate: string;
  endDate: string;
  translations: { [key in SupportedLanguagesCode]?: string };
}

export type AllPublicHolidays = {
  [key in CountryCodes]?: PublicHoliday[];
};
