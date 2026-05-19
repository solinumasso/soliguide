import {
  WelcomedPublics,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "@soliguide/common";

export interface SearchFilterParams {
  accueil?: WelcomedPublics;
  administrative?: PublicsAdministrative;
  age?: number;
  animal?: boolean;
  appointment?: boolean;
  familialle?: PublicsFamily;
  gender?: PublicsGender;
  hours?: { start: number | string; end: number | string };
  inconditionnel?: boolean;
  inscription?: boolean;
  languages?: string;
  openToday?: boolean;
  orientation?: boolean;
  other?: PublicsOther;
  pmr?: boolean;
  price?: boolean;
  sign?: boolean;
}
