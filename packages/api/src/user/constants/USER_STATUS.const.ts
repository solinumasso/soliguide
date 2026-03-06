import {
  UserStatus,
  UserStatusNotLogged,
  AllUserStatus,
} from "@soliguide/common";

export const USER_STATUS_FOR_LOGS: AllUserStatus[] = [
  UserStatusNotLogged.NOT_LOGGED as AllUserStatus,
].concat(Object.values(UserStatus));
