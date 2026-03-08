import { ApiOrganization } from "../../organization";
import { UserRole } from "../enums";
import { CommonUser } from "../interfaces";

export type UserForAuth = Pick<
  CommonUser,
  | "categoriesLimitations"
  | "devToken"
  | "languages"
  | "lastname"
  | "mail"
  | "name"
  | "phone"
  | "selectedOrgaIndex"
  | "status"
  | "title"
  | "translator"
  | "user_id"
  | "areas"
  | "lastLogin"
  | "verified"
> &
  Required<{
    _id: string;
    places: number[];
    role: UserRole;
    organizations: Array<
      Pick<ApiOrganization, "_id" | "organization_id" | "name">
    >;
  }>;
