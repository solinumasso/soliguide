import { SupportedLanguagesCode } from "../../translations";
import { Categories } from "../../categories";
import { UserStatus } from "..";
import { Phone } from "../../phone";
import { AnyDepartmentCode } from "../../location";
import { OperationalAreas } from "../types/OperationalAreas.type";

export interface CommonUser {
  _id?: any;
  verified: boolean;
  name: string;
  lastname: string;
  phone: Phone | null;
  mail: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
  blocked: boolean;
  status: UserStatus;
  languages: SupportedLanguagesCode[];
  selectedOrgaIndex: number;
  user_id: number;
  categoriesLimitations?: Categories[];
  devToken: string | null;
  passwordToken?: string | null;
  territories: AnyDepartmentCode[];
  translator: boolean;
  verifiedAt: Date | null;

  invitations: any[];
  organizations: any[];
  areas?: OperationalAreas;
  lastLogin: Date | null;
}
