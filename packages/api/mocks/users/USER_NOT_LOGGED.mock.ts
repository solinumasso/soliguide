import { UserStatusNotLogged, UserTypeLogged } from "@soliguide/common";
import { DEFAULT_USER_PROPS } from "../../src/user/constants";

export const USER_NOT_LOGGED: any = {
  ...DEFAULT_USER_PROPS,
  ...{
    status: UserStatusNotLogged.NOT_LOGGED,
    type: UserTypeLogged.NOT_LOGGED,
    isLogged() {
      return false;
    },
  },
};
