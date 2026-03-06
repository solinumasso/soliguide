import { SoliguideCountries } from "@soliguide/common";

export type UserSignup = {
  invitation?: string;
  organization?: string;
  mail: string;
  name: string;
  lastname: string;
  password: string;
  languages?: string[];
  title?: string;
  phone?: string;
  translator?: boolean;
  territories?: string[];
  country: SoliguideCountries;
};
