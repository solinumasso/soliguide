
import { DOMAINS_ADMIN_TERRITORIES } from "../constants";
import { UserStatus } from "../enums";

export const validateUserStatusWithEmail = (
  status: UserStatus,
  email?: string
):
  | { required: true }
  | { invalidAdminSoliguideEmail: true }
  | { invalidAdminTerritoryEmail: true }
  | { invalidSimpleUserEmail: true }
  | null => {
  if (!email) {
    return { required: true };
  }

  const domain = email?.substring(email.lastIndexOf("@") + 1);

  if (
    status === UserStatus.ADMIN_SOLIGUIDE ||
    status === UserStatus.ADMIN_TERRITORY ||
    status === UserStatus.SOLI_BOT
  ) {
    if (
      (status === UserStatus.ADMIN_SOLIGUIDE ||
        status === UserStatus.SOLI_BOT) &&
      domain !== "solinum.org"
    ) {
      return { invalidAdminSoliguideEmail: true };
    } else if (
      status === UserStatus.ADMIN_TERRITORY &&
      !DOMAINS_ADMIN_TERRITORIES.includes(domain)
    ) {
      return { invalidAdminTerritoryEmail: true };
    }
    return null;
  }

  // We can't have users with admin domain & another status (api, simple user, etc)
  if (domain === "solinum.org" || DOMAINS_ADMIN_TERRITORIES.includes(domain)) {
    return { invalidSimpleUserEmail: true };
  }

  return null;
};
