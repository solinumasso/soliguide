import mongoose from "mongoose";

import { CountryCodes, UserStatus, UserTypeLogged } from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";
import { UserPopulateType } from "../../src/_models";

export const USER_ADMIN_SOLIGUIDE: UserPopulateType = {
  ...ABSTRACT_USER,
  ...{
    _id: new mongoose.Types.ObjectId(123),
    createdAt: new Date("2019-07-28T21:07:28.007Z"),
    lastname: "NOM_SOLIGUIDE_ADMIN",
    mail: "USER@solinum.org",
    name: "PRENOM_SOLIGUIDE_ADMIN",
    password: "xoksopkwpoxkswpokxopwskopxswSC",
    passwordToken: "$ccccccccccG",
    phone: {
      label: null,
      phoneNumber: "0667434205",
      countryCode: CountryCodes.FR,
      isSpecialPhoneNumber: false,
    },
    status: UserStatus.ADMIN_SOLIGUIDE,
    territories: ["75"],
    places: [],
    userRights: [],
    organizations: [],
    invitations: [],
    title: "Chips",
    updatedAt: new Date("2021-04-29T08:20:04.247Z"),
    user_id: 123,
    verified: true,
    lastLogin: new Date("2025-07-28T21:07:28.007Z"),
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
