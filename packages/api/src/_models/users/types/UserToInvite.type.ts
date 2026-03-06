import { Phone, SoliguideCountries, UserRole } from "@soliguide/common";
import { User } from "../interfaces/User.interface";

export type UserToInvite = Pick<User, "name" | "lastname" | "mail"> & {
  phone?: Phone | null;
  title?: string | null;
  organization: string | number;
  role: UserRole;
  places: number[] | string[];
  country: SoliguideCountries;
};
