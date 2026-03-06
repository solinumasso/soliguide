import { UserStatus } from "@soliguide/common";
import { ModelWithId, User } from "../../_models";

export const DEFAULT_USER_PROPS: Pick<
  ModelWithId<User>,
  | "blocked"
  | "categoriesLimitations"
  | "devToken"
  | "invitations"
  | "languages"
  | "organizations"
  | "passwordToken"
  | "phone"
  | "selectedOrgaIndex"
  | "status"
  | "territories"
  | "title"
  | "translator"
  | "verified"
  | "verifiedAt"
> = {
  blocked: false,

  categoriesLimitations: [],
  devToken: null,
  invitations: [],
  languages: [],
  organizations: [],
  passwordToken: null,
  phone: null,
  selectedOrgaIndex: 0,
  status: UserStatus.SIMPLE_USER,
  territories: [],
  title: null,
  translator: false,
  verified: false,
  verifiedAt: null,
};
