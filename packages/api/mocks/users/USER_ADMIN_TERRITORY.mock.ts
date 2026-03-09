import mongoose from "mongoose";
import {
  CountryAreaTerritories,
  CountryCodes,
  UserStatus,
  UserTypeLogged,
} from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";
import { UserPopulateType } from "../../src/_models";

const areas = {
  fr: new CountryAreaTerritories<CountryCodes.FR>({
    departments: ["93"],
  }),
};

export const USER_ADMIN_TERRITORY: UserPopulateType = {
  ...ABSTRACT_USER,
  ...{
    areas,
    _id: new mongoose.Types.ObjectId(345),
    createdAt: new Date("2019-07-28T21:07:28.007Z"),
    lastname: "Team SSD",
    mail: "mon-territoire@soliguide.fr",
    name: "Prénom SSD",
    password: "xxxxxx",
    passwordToken: "xxxxxxx",
    phone: {
      label: null,
      isSpecialPhoneNumber: false,
      countryCode: CountryCodes.FR,
      phoneNumber: "0667434205",
    },
    status: UserStatus.ADMIN_TERRITORY,
    territories: ["93"],
    places: [],
    userRights: [],
    organizations: [],
    invitations: [],
    title: "Gérant autonome de la seine-saint-denis",
    updatedAt: new Date("2021-04-29T08:20:04.247Z"),
    user_id: 345,
    lastLogin: new Date("2025-04-29T08:20:04.247Z"),
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
