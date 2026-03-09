import {
  UserRightStatus,
  UserRole,
  UserStatus,
  UserTypeLogged,
} from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";
import mongoose from "mongoose";

export const USER_PRO_ROLES_POPULATED: any = {
  ...ABSTRACT_USER,
  ...{
    _id: "USER_OWNER_1",
    createdAt: new Date("2020-12-14T15:58:49.902Z"),
    lastname: "Nom-pro",
    mail: "mail-user-pro@structure.fr",
    name: "Marcel",
    organizations: [
      {
        _id: "ORGA_ID_1",
        name: "Organisme de test",
        organization_id: 2316,
        territories: ["75"],
      },
    ] as any,
    password: "$2a$0xoksopkwpoxkswpokxopwskopxswSCxd/KTIjJNe",
    userRights: [
      {
        _id: new mongoose.Types.ObjectId("6143bd52dc16136ff405ee36"),
        displayContactPro: false,
        organization: "ORGA_TEST_ID",
        organization_id: 2396,
        place: "PLACE_ID_2",
        place_id: 3117,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: {
          _id: "USER_OWNER_1",
          lastname: "Eriksen",
          mail: "paul@soliguide.dev",
          name: "Paul",
          phone: null,
          status: UserStatus.PRO,
          title: null,
        },
        user_id: 577,
      },
      {
        _id: new mongoose.Types.ObjectId("6143bd52dc16136ff405ee37"),
        displayContactPro: false,
        organization: "ORGA_TEST_ID",
        organization_id: 2396,
        place: "PLACE_ID_1",
        place_id: 3119,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: {
          _id: "USER_OWNER_1",
          lastname: "Eriksen",
          mail: "paul@soliguide.dev",
          name: "Paul",
          phone: null,
          status: UserStatus.PRO,
          title: null,
        },
        user_id: 577,
      },
      {
        _id: new mongoose.Types.ObjectId("6143bd52dc16136ff405ee38"),
        displayContactPro: false,
        organization: "ORGA_TEST_ID",
        organization_id: 2396,
        place: "PLACE_ID_3",
        place_id: 11097,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: {
          _id: "USER_OWNER_1",
          lastname: "Eriksen",
          mail: "paul@soliguide.dev",
          name: "Paul",
          phone: null,
          status: UserStatus.PRO,
          title: null,
        },
        user_id: 577,
      },
    ] as any,
    invitations: [],
    selectedOrgaIndex: 0,
    status: UserStatus.PRO,
    updatedAt: new Date("2020-12-14T16:28:23.676Z"),
    user_id: 984,
  },
  type: UserTypeLogged.LOGGED,
  isLogged() {
    return true;
  },
};
