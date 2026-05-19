import {
  AnyDepartmentCode,
  SupportedLanguagesCode,
  UserRole,
  UserStatus,
  Phone,
} from "@soliguide/common";

export interface UserOrganisation {
  organization_id: number;
  name: string;
  territories: AnyDepartmentCode[];
}

export class User {
  public user_id: number | null = null;
  public _id: string | null = null;
  public mail = "";
  public name = "";
  public lastname = "";
  public phone: Phone | null = null;
  public languages: SupportedLanguagesCode[] = [];
  public organizations: UserOrganisation[] = [];
  public currentOrga: UserOrganisation | null = null;
  public selectedOrgaIndex = 0;
  public role: UserRole | null = null;
  public admin = false;
  public translator = false;
  public territories: AnyDepartmentCode[] = [];
  public status: UserStatus = UserStatus.SIMPLE_USER;
  public pro = false;
  public token: string | null = null;
  public verified = false;
}
