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
