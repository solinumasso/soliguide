import mongoose from "mongoose";
import { UserStatus, UserTypeLogged } from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";

export const USER_PRO: any = {
  ...ABSTRACT_USER,
  ...{
    _id: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
    blocked: false,
    createdAt: new Date("2020-12-14T15:58:49.902Z"),
    lastname: "Nom-pro",
    mail: "mail-user-pro@structure.fr",
    name: "Marcel",
    organizations: [
      {
        _id: "5fb648823cb90874d9ab1bef",
        name: "Organisme de test",
        organization_id: 2316,
        territories: ["75"],
      },
    ],
    password: "$2a$0xoksopkwpoxkswpokxopwskopxswSCxd/KTIjJNe",
    userRights: [new mongoose.Types.ObjectId("61162ee115b29bc0c080db98")],
    selectedOrgaIndex: 0,
    status: UserStatus.PRO,
    territories: ["75"],
    title: "Président de la structure",
    updatedAt: new Date("2020-12-14T16:28:23.676Z"),
    user_id: 451,
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
