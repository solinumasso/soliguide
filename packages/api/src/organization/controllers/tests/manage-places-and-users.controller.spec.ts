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
import "../../../place/models/photo.model";
import "../../../place/models/document.model";
import "../../../translations/models/translatedPlace.model";
import "../../../translations/models/translatedField.model";
import "../../../user/models/invitation.model";
import mongoose from "mongoose";
import { CountryCodes, UserRole } from "@soliguide/common";

import {
  ONLINE_PLACE,
  USER_PRO,
  USER_ADMIN_SOLIGUIDE,
} from "../../../../mocks";

import {
  OrganizationPopulate,
  UserPopulateType,
  UserRight,
  UserRightOrganizationPopulate,
} from "../../../_models";
import {
  addPlaceToOrga,
  removePlaceFromOrga,
  removeUserFromOrga,
} from "../manage-places-and-users.controller";
import {
  createUser,
  getUserByIdWithUserRights,
  getUserRightsWithParams,
} from "../../../user/services";
import {
  createOrganization,
  removeOrganization,
} from "../organization.controller";
import { getOrganizationByParams } from "../../services";
import { deleteUser } from "../../../user/controllers/user-admin.controller";
import {
  addNewPlace,
  getNextPlaceId,
} from "../../../place/services/admin-place.service";
import { deletePlace } from "../../../place/controllers";
import { getRandomString } from "../../../../e2e/getRandomString";
import {
  createUserWithInvitation,
  validateInvitation,
} from "../../../user/controllers/invite-user.controller";
import { CREATE_ORGA_OK_COMPLETE } from "../../../../e2e/admin-organization/bodies/CREATE_ORGA.const";

let place1: any;
let place2: any;
let organization: OrganizationPopulate;

let user: UserPopulateType;
let newUser: UserPopulateType;

describe("Tests of the organizations' controller", () => {
  beforeAll(async () => {
    // 1 - Create two places
    const newPlace = {
      ...ONLINE_PLACE,
      _id: undefined,
    };
    newPlace.lieu_id = await getNextPlaceId();

    place1 = await addNewPlace({ ...newPlace, name: "Place n°1" });
    place2 = await addNewPlace({
      ...newPlace,
      name: "Place n°2",
      lieu_id: place1.lieu_id + 1,
    });

    // 2 - Create one organization
    const newOrganization = await createOrganization(CREATE_ORGA_OK_COMPLETE);

    organization = (await getOrganizationByParams({
      _id: newOrganization._id,
    })) as OrganizationPopulate;

    // 3 - Create one user
    const fakeUser = {
      ...USER_PRO,
      _id: new mongoose.Types.ObjectId(),
      userRights: [],
      createdAt: null,
      updatedAt: null,
      organizations: [],
      mail: `${getRandomString()}.xx@xx.fr`,
    };
    user = (await createUser(fakeUser)) as UserPopulateType;
  });

  describe("Should add a place into an organization", () => {
    it("1 - Should update organization's places", async () => {
      organization = (await addPlaceToOrga(
        place1,
        organization
      )) as OrganizationPopulate;
      expect(organization.places.length).toEqual(1);
      expect(organization.places[0]._id).toEqual(place1._id);
    });

    it("2 - Should not create any rights for users", async () => {
      const userRights = await getUserRightsWithParams({
        organization: organization._id,
      });
      expect(userRights.length).toEqual(0);
    });
  });

  describe("should add a user to an organization", () => {
    it("Should invite a user to an organization", async () => {
      // Invite this user in current organization
      const invitation = await createUserWithInvitation(
        {
          mail: user.mail,
          name: user.name,
          lastname: user.lastname,
          organization: organization._id.toString(),
          role: UserRole.OWNER,
          places: [],
          country: CountryCodes.FR,
        },
        USER_ADMIN_SOLIGUIDE,
        organization
      );

      newUser = await validateInvitation(invitation);
      expect(newUser).toBeDefined();
    });

    it("should update organization's users, roles", async () => {
      organization = (await getOrganizationByParams({
        _id: organization._id,
      })) as OrganizationPopulate;
      expect(organization.places.length).toEqual(1);
      expect(organization.users.length).toEqual(1);
    });

    it("should create two userRights", () => {
      // Two userRights : one with a placeId, one whitout
      expect(newUser.userRights.length).toEqual(2);
      expect(
        newUser.userRights.filter((userRight: UserRight) => !userRight.place)
          .length
      ).toEqual(1);

      expect(
        newUser.userRights.filter(
          (userRight: UserRight) => userRight.place_id === place1.lieu_id
        ).length
      ).toEqual(1);
    });
  });

  describe("should add a second place to an organization", () => {
    beforeAll(async () => {
      organization = (await addPlaceToOrga(
        place2,
        organization
      )) as OrganizationPopulate;
    });
    it("should create new user rights", async () => {
      // Check userRights model
      const userRights = await getUserRightsWithParams({
        organization: organization._id,
      });

      // One user + Two places = Three user rights
      // Two rights associate to a place, and one with "place_id" as null
      expect(userRights.length).toEqual(3);

      // Two user-rights for two different users
      expect(
        userRights.filter(
          (userRight: UserRightOrganizationPopulate) => userRight.place_id
        ).length
      ).toEqual(2);
    });
    it("should update organization's users, roles", () => {
      expect(organization.places.length).toEqual(2);
      expect(organization.users.length).toEqual(1);
    });
  });

  describe("should delete elements in an organization", () => {
    it("should delete a place from an organization", async () => {
      organization = (await removePlaceFromOrga(
        organization,
        place2
      )) as OrganizationPopulate;

      expect(organization.places.length).toEqual(1);
      const userRights = await getUserRightsWithParams({
        organization: organization._id,
      });
      expect(userRights.length).toEqual(2);
    });

    it("should delete a user from an organization", async () => {
      organization = (await removeUserFromOrga(
        user,
        organization
      )) as OrganizationPopulate;

      expect(organization.users.length).toEqual(0);

      const userRights = await getUserRightsWithParams({
        organization: organization._id,
      });

      expect(userRights.length).toEqual(0);
    });

    it("should delete the created organization", async () => {
      await removeOrganization(organization);

      const userRights = await getUserRightsWithParams({
        organization: organization._id,
      });

      user = (await getUserByIdWithUserRights(user._id)) as UserPopulateType;
      expect(userRights.length).toEqual(0);
      expect(user.userRights.length).toEqual(0);
    });
  });

  afterAll(async () => {
    await removeOrganization(organization);
    await deletePlace(place1);
    await deletePlace(place2);
    await deleteUser(user);
    await deleteUser(newUser);
    mongoose.connection.close();
  });
});
