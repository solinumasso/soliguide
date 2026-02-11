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
import mongoose from "mongoose";

import { CountryCodes } from "@soliguide/common";

import * as UserController from "./user.controller";
import * as UserAdminController from "./user-admin.controller";
import * as OrganizationController from "../../organization/controllers/organization.controller";
import { UserPopulateType } from "../../_models";
import { ORGANIZATION, USER_SIMPLE } from "../../../mocks";
import { getUserByIdWithUserRights } from "../services";
import { getRandomString } from "../../../e2e/getRandomString";

describe("UserController", () => {
  let organization: any;
  let user: UserPopulateType;

  beforeAll(async () => {
    delete ORGANIZATION["_id"];

    organization = await OrganizationController.createOrganization({
      ...ORGANIZATION,
      country: CountryCodes.FR,
      mail: `${getRandomString()}.xx@xx.fr`,
    });
  });

  it("Must create a user without invitation", async () => {
    const createdUser = await UserController.signupWithoutInvitation({
      ...USER_SIMPLE,
      country: CountryCodes.FR,
    });
    expect(createdUser).not.toBeNull();
    user = createdUser!;
    expect(createdUser!.name).toEqual(USER_SIMPLE.name);
  });

  it("Must update the phone number", async () => {
    const patchedUser = await UserController.patchUserAccount(user._id, {
      phone: {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    });
    expect(patchedUser).toBeTruthy();
    expect(patchedUser?.phone?.phoneNumber).toEqual("0606060606");
    expect(patchedUser?.phone?.countryCode).toEqual(CountryCodes.FR);

    user = patchedUser!;
  });

  describe("Must get a user", () => {
    it("using its email", async () => {
      const retrievedUser = await UserController.getUserByEmail(user.mail);
      expect(retrievedUser).not.toBeNull();
      expect(retrievedUser!._id.toString()).toEqual(user._id.toString());
    });

    it("using its userObjectId", async () => {
      const retrievedUser = await getUserByIdWithUserRights(
        user._id.toString()
      );
      expect(retrievedUser).not.toBeNull();
      expect(retrievedUser!._id.toString()).toEqual(user._id.toString());
    });
  });

  describe("Must check whether a user belongs to an organization", () => {
    it("should return false", async () => {
      const response = await UserController.isUserInOrga(
        user.mail,
        organization.organization_id
      );
      expect(response).toBe(false);
    });
  });

  afterAll(async () => {
    await OrganizationController.removeOrganization(organization);
    await UserAdminController.deleteUser(user);
    mongoose.connection.close();
  });
});
