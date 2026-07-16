import { UserStatus } from "@soliguide/common";
import { ModelWithId, User } from "../../_models";

// `campaignUserUuid` is intentionally NOT set here: it must be unique per user.
// The Mongoose schema owns it via `default: () => randomUUID()`, which runs once
// per document. Baking a single value into this shared constant reused the same
// UUID for every user created in the process lifetime, causing an E11000
// duplicate key error on the second creation (unique index `campaignUserUuid_1`).
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
