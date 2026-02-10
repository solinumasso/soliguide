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

import * as UserAdminController from "./user-admin.controller";

import { createUser } from "../services";

import { USER_ADMIN_SOLIGUIDE, USER_PRO } from "../../../mocks";
import { UserPopulateType } from "../../_models";
import { UserStatus } from "@soliguide/common";

describe("UserAdminController", () => {
  let user: UserPopulateType;

  beforeAll(async () => {
    delete USER_PRO["_id"];
    delete USER_PRO["user_id"];
    delete USER_PRO["createdAt"];
    delete USER_PRO["updatedAt"];
    delete USER_PRO["userRights"];
    delete USER_PRO["organizations"];

    const createdUser = await createUser(USER_PRO);
    if (!createdUser) {
      fail(`Failed to create user ${USER_PRO}`);
    }
    user = createdUser;
  });

  it("search for a user", async () => {
    const users = await UserAdminController.searchUsers(
      { status: UserStatus.PRO },
      USER_ADMIN_SOLIGUIDE
    );

    const userObjectId = users.results.find(
      (userResult) => userResult._id.toString() === user._id.toString()
    );

    expect(users.nbResults).toBeGreaterThan(0);
    expect(userObjectId).not.toBeNull();
  });

  it("create a token for API", async () => {
    const userWithDevToken = await UserAdminController.createDevToken(
      user._id.toString()
    );

    expect(userWithDevToken).not.toBeNull();
    expect(userWithDevToken!.devToken).not.toBeNull();
    user = userWithDevToken!;
  });

  afterAll(async () => {
    if (user) {
      await UserAdminController.deleteUser(user);
    }

    mongoose.connection.close();
  });
});
