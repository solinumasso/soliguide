import { USER_INVITED_MOCK } from "./USER_INVITED.mock";

import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

import { Invitation } from "../src/app/modules/users/classes/invitation.class";

import { Place } from "../src/app/models/place/classes/place.class";
import { CommonUser, UserRole } from "@soliguide/common";

export const INVITATION_MOCK: Invitation = new Invitation({
  _id: "61162b27e6d334ae18df486e",
  roleType: UserRole.EDITOR,
  createdAt: new Date("2020-11-19T11:25:48.998Z"),
  territories: [],
  organization: new Organisation({
    _id: "5fb62de33cb90874d9ab1699",
    createdAt: new Date("2020-11-19T08:33:39.326Z"),
    invitations: [new Invitation()],
    name: "Organisme de test",
    organization_id: 951,
    places: [new Place()],
    territories: ["75"],
    updatedAt: new Date("2021-03-31T16:08:46.215Z"),
    verified: {
      date: new Date("2021-03-31T16:08:46.000Z"),
      status: true,
    },
  }),
  organizationName: "Organisme de test",
  organization_id: 951,
  pending: true,
  token: "XXX_TOKEN_XXX",
  user: {
    ...USER_INVITED_MOCK,
  } as CommonUser,
  user_id: 1433,
});
