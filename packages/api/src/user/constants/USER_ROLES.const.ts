
import { UserRole } from "@soliguide/common";

export const USER_ROLES_FOR_EDITION = [UserRole.OWNER, UserRole.EDITOR];
export const USER_ROLES = USER_ROLES_FOR_EDITION.concat([UserRole.READER]);
export const USER_ROLES_FOR_LOGS: (string | null)[] = ["BOT", null].concat(
  USER_ROLES
);
