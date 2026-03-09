import mongoose from "mongoose";

import {
  CountryAreaTerritories,
  CountryCodes,
  RELATIONS,
  UserRole,
} from "@soliguide/common";

import { USER_INVITED } from "./users/USER_INVITED.mock";
import type { InvitationPopulate } from "../src/_models";

export const INVITATION: InvitationPopulate = {
  _id: new mongoose.Types.ObjectId("61162b27e6d334ae18df486e"),
  createdAt: new Date("2020-11-19T11:25:48.998Z"),
  createdBy: new mongoose.Types.ObjectId("5fb62de33cb90874d9ab1699"),
  organization: {
    _id: new mongoose.Types.ObjectId("5fb62de33cb90874d9ab1699"),
    createdAt: new Date("2020-11-19T08:33:39.326Z"),
    invitations: ["XXX_INVITATION_XXX"],
    name: "Organisme de test",
    organization_id: 951,
    places: ["5fad0102d90fa36f4aa39203"],

    territories: ["75"],
    updatedAt: new Date("2021-03-31T16:08:46.215Z"),
    users: ["60649e8ed282f85e679c9849", "61162b1fe6d334ae18df3e36"],

    verified: {
      date: new Date("2021-03-31T16:08:46.000Z"),
      status: true,
    },
    counters: {
      invitations: {
        EDITOR: 0,
        OWNER: 1,
        READER: 0,
        TOTAL: 1,
      },
      users: {
        EDITOR: 0,
        OWNER: 0,
        READER: 0,
        TOTAL: 0,
      },
    },
    description: "",
    facebook: "",
    fax: null,
    phone: null,
    mail: "",
    website: null,
    logo: "",
    priority: false,
    relations: [RELATIONS[1]],
    roles: [],
    areas: {
      fr: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["01", "03"],
      }),
    },
    lastLogin: null,
  },

  roleType: UserRole.OWNER,
  organizationName: "Organisme de test",
  organization_id: 951,
  pending: true,
  token: "XXX_TOKEN_XXX",
  user: { ...USER_INVITED },
  user_id: 1433,
  territories: ["75"],
};
