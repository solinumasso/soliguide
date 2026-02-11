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

import "../../../config/database/connection";

import mongoose from "mongoose";
import request from "supertest";
import { CountryCodes, UserStatus } from "@soliguide/common";

import { app } from "../../../app";
import * as UserController from "../user.controller";
import * as UserAdminController from "../user-admin.controller";
import { USER_SIMPLE } from "../../../../mocks";
import { getRandomString } from "../../../../e2e/getRandomString";
import { getUserByIdWithUserRights } from "../../services";
import { UserModel } from "../../models/user.model";

describe("LastLogin Integration Tests", () => {
  let user: any;
  let userMail: string;
  let userPassword: string;

  beforeAll(async () => {
    // Create user
    userMail = `${getRandomString()}@test.fr`;
    userPassword = `Password${getRandomString()}123!`;
    const createdUser = await UserController.signupWithoutInvitation({
      ...USER_SIMPLE,
      mail: userMail,
      password: userPassword,
      country: CountryCodes.FR,
      status: UserStatus.PRO,
    });
    user = createdUser!;

    // Reset lastLogin to null to simulate a newly created user
    await UserModel.findByIdAndUpdate(user._id, { lastLogin: null });
  });

  afterAll(async () => {
    await UserAdminController.deleteUser(user);
    await mongoose.connection.close();
  });

  describe("User lastLogin", () => {
    it("should have null lastLogin for newly created user", async () => {
      const retrievedUser = await getUserByIdWithUserRights(user._id);
      expect(retrievedUser?.lastLogin).toBeNull();
    });

    it("should set lastLogin when user logs in for the first time", async () => {
      const beforeLogin = new Date();

      // Login via HTTP request to trigger middleware
      const loginResponse = await request(app)
        .post("/users/signin")
        .set("Origin", "https://soliguide.fr")
        .send({
          mail: userMail,
          password: userPassword,
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;

      // Make an authenticated request to trigger updateLastLogin middleware
      await request(app)
        .get("/users/me")
        .set("Origin", "https://soliguide.fr")
        .set("Authorization", `JWT ${token}`);

      // Check that lastLogin was updated
      const updatedUser = await getUserByIdWithUserRights(user._id);
      expect(updatedUser?.lastLogin).not.toBeNull();
      expect(updatedUser?.lastLogin).toBeInstanceOf(Date);
      expect(updatedUser!.lastLogin!.getTime()).toBeGreaterThanOrEqual(
        beforeLogin.getTime()
      );
    });

    it("should not update lastLogin when user logs in again on the same day", async () => {
      // Get current lastLogin
      const userBeforeSecondLogin = await getUserByIdWithUserRights(user._id);
      const firstLoginDate = userBeforeSecondLogin?.lastLogin;

      // Login again via HTTP
      const loginResponse = await request(app)
        .post("/users/signin")
        .set("Origin", "https://soliguide.fr")
        .send({
          mail: userMail,
          password: userPassword,
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;

      // Make an authenticated request to trigger updateLastLogin middleware
      await request(app)
        .get("/users/me")
        .set("Origin", "https://soliguide.fr")
        .set("Authorization", `JWT ${token}`);

      // Check that lastLogin was NOT updated (same day)
      const userAfterSecondLogin = await getUserByIdWithUserRights(user._id);
      expect(userAfterSecondLogin?.lastLogin?.getTime()).toEqual(
        firstLoginDate?.getTime()
      );
    });

    it("should update lastLogin when user logs in on a different day", async () => {
      // Manually set lastLogin to yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await UserModel.findByIdAndUpdate(user._id, {
        lastLogin: yesterday,
      });

      // Verify it was set
      const userWithYesterdayLogin = await getUserByIdWithUserRights(user._id);
      expect(userWithYesterdayLogin?.lastLogin?.getDate()).toEqual(
        yesterday.getDate()
      );

      // Login via HTTP
      const beforeLogin = new Date();
      const loginResponse = await request(app)
        .post("/users/signin")
        .set("Origin", "https://soliguide.fr")
        .send({
          mail: userMail,
          password: userPassword,
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;

      // Make an authenticated request to trigger updateLastLogin middleware
      await request(app)
        .get("/users/me")
        .set("Origin", "https://soliguide.fr")
        .set("Authorization", `JWT ${token}`);

      // Check that lastLogin was updated to today
      const updatedUser = await getUserByIdWithUserRights(user._id);
      expect(updatedUser?.lastLogin).not.toBeNull();
      expect(updatedUser!.lastLogin!.getTime()).toBeGreaterThanOrEqual(
        beforeLogin.getTime()
      );
      expect(updatedUser!.lastLogin!.getDate()).toEqual(new Date().getDate());
    });
  });

  describe("Multiple independent users", () => {
    let user2: any;
    let user2Mail: string;
    let user2Password: string;

    beforeAll(async () => {
      user2Mail = `${getRandomString()}@test.fr`;
      user2Password = `Password${getRandomString()}123!`;
      const createdUser2 = await UserController.signupWithoutInvitation({
        ...USER_SIMPLE,
        mail: user2Mail,
        password: user2Password,
        country: CountryCodes.FR,
        status: UserStatus.PRO,
      });
      user2 = createdUser2!;

      // Reset lastLogin to null to simulate a newly created user
      await UserModel.findByIdAndUpdate(user2._id, { lastLogin: null });
    });

    afterAll(async () => {
      await UserAdminController.deleteUser(user2);
    });
  });
});
