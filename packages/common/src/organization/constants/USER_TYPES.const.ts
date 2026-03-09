import { UserTypes } from "../types/UserTypes.type";

export const USER_TYPES = [
  "USERS",
  "NO_USERS",
  "INVITATIONS",
  "NO_INVITATIONS",
  "NONE",
] as const;

export const USER_TYPES_TO_READABLE: {
  [key in UserTypes]: string;
} = {
  USERS: "AT_LEAST_ONE_PRO_ACCOUNT_VALIDATED",
  NO_USERS: "NO_PRO_ACCOUNT_VALIDATED",
  INVITATIONS: "AT_LEAST_ONE_INVITATION",
  NO_INVITATIONS: "NO_INVITATION",
  NONE: "NO_PRO_ACCOUNT_OR_INVITATION",
};
