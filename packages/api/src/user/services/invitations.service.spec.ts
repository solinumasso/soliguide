/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import "../../config/database/connection";

import "../models/user.model";
import "../models/userRight.model";
import "../../organization/models/organization.model";
import "../../place/models/place.model";

import mongoose from "mongoose";

import {
  createInvitation,
  deleteInvitationWithParams,
} from "./invitations.service";
import type {
  Invitation,
  InvitationPopulate,
  SignupUser,
  User,
  UserPopulateType,
} from "../../_models";
import { saveUserRights, deleteUserRights } from "./userRights.service";
import { createUser, deleteUserWithParams } from "./users.service";

import { USER_INVITED, ABSTRACT_USER } from "../../../mocks";

import {
  CountryCodes,
  UserRightStatus,
  UserRole,
  UserTypeLogged,
} from "@soliguide/common";
import { deleteOrgaWithParams } from "../../organization/services";
import { createOrganization } from "../../organization/controllers/organization.controller";
import { CREATE_ORGA_OK_SIMPLE } from "../../../e2e/admin-organization/bodies/CREATE_ORGA.const";

let invitation: Invitation | InvitationPopulate | null = null;
let organization: any;
let userRights: mongoose.Types.ObjectId[];
let userInvited: UserPopulateType | null = null;

describe("InvitationsService", () => {
  beforeAll(async () => {
    organization = await createOrganization(CREATE_ORGA_OK_SIMPLE);

    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["_id"];
    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["user_id"];
    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["createdAt"];
    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["updatedAt"];
    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["invitations"];
    // @ts-expect-error - delete is easier here and acceptable in tests
    delete USER_INVITED["organizations"];

    USER_INVITED.mail = "accueil@spf.biarritz.fr";

    const user = { ...USER_INVITED, country: CountryCodes.FR } as SignupUser &
      Pick<User, "status" | "verified" | "verifiedAt">;

    userInvited = (await createUser(user)) as UserPopulateType;

    if (!userInvited) {
      fail(`Create user failed for ${user.mail}`);
    }

    const userRight = {
      displayContactPro: false,
      organization: organization._id,
      organization_id: organization.organization_id,
      place: null,
      place_id: null,
      role: UserRole.OWNER,
      status: UserRightStatus.PENDING,
      user: userInvited._id,
      user_id: userInvited.user_id,
    };

    userRights = await saveUserRights([userRight], undefined, true);
  });

  it("must create an invitation", async () => {
    const userWhoInvite: UserPopulateType = {
      ...ABSTRACT_USER,
      ...{
        territories: ["93"],
        _id: new mongoose.Types.ObjectId("e02a5c5f7acf59698383961f"),
        lastname: "Merveille",
        name: "Marie",
        mail: "foo.bar@toto.com",
        user_id: 415,
        createdAt: new Date(),
        updatedAt: new Date(),
        invitations: [],
        organizations: [],
        userRights: [],
        places: [],
        type: UserTypeLogged.LOGGED,
      },
    };

    invitation = await createInvitation(
      userWhoInvite,
      organization,
      userInvited!, // skipcq: JS-0339
      UserRole.OWNER,
      CountryCodes.FR
    );

    expect(invitation.user_id).toBe(userInvited!.user_id);
  });

  afterAll(async () => {
    if (invitation) {
      await deleteInvitationWithParams({
        _id: invitation._id,
      });
    }

    if (userRights) {
      for (const right of userRights) {
        await deleteUserRights({ _id: right._id });
      }
    }

    if (userInvited) {
      await deleteUserWithParams({ _id: userInvited._id });
    }

    if (organization) {
      await deleteOrgaWithParams(organization);
    }

    mongoose.connection.close();
  });
});
