import mongoose from "mongoose";
import { ModelWithId, User } from "../../src/_models";
import {
  CountryAreaTerritories,
  CountryCodes,
  UserStatus,
  UserTypeLogged,
} from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";

export const USER_INVITED: ModelWithId<User> = {
  ...ABSTRACT_USER,
  ...{
    _id: new mongoose.Types.ObjectId("61162ee315b29bc0c080e458"),
    blocked: false,
    createdAt: new Date("2020-11-19T11:25:48.998Z"),
    updatedAt: new Date("2020-11-19T11:25:48.998Z"),
    invitations: [
      new mongoose.Types.ObjectId("61162eeb15b29bc0c080ee90"),
      new mongoose.Types.ObjectId("61162eec15b29bc0c080f13f"),
      new mongoose.Types.ObjectId("61162eec15b29bc0c080f14e"),
    ],
    lastname: "Nom invité",
    mail: "user-invited@mail.com",
    name: "Prénom invité",
    password: "$2a$04$f4/AtNKjcbHYSwjefwmBVOp.KVkhFjsk1qqX31kzy7SZ3GbQwmkhW",
    status: UserStatus.PRO,
    territories: ["93"],
    areas: {
      fr: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["93"],
      }),
    },
    user_id: 1433,
    lastLogin: null,
    verified: false,
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
