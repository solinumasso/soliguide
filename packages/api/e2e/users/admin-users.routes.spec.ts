import mongoose from "mongoose";

import {
  CountryCodes,
  DEPARTMENT_CODES,
  UserSearchContext,
  UserStatus,
} from "@soliguide/common";

import { addAuth, getExpectedStatus, supertest } from "../endPointTester";
import { ExpectedStatus, TestAccounts } from "../endPointTester.type";

import type { SignupUser, UserPopulateType } from "../../src/_models";
import { deleteUser } from "../../src/user/controllers/user-admin.controller";
import { getUserByIdWithUserRights } from "../../src/user/services";
import { signupWithoutInvitation } from "../../src/user/controllers/user.controller";
import { getRandomString } from "../getRandomString";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

describe.each(Object.values(TestAccounts))(
  "Test for the routes /users/signup, /admin/users/search/ and /admin/users/delete/?userObjectId",
  (currentTestAccount) => {
    let successStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentTestAccount,
      ExpectedStatus.SUCCESS
    );

    const failStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentTestAccount,
      ExpectedStatus.FAIL
    );

    const testUser: SignupUser = {
      name: "Foo",
      lastname: "Bar",
      mail: `${currentTestAccount}.foo.bar@solinum.org`,
      status: UserStatus.SOLI_BOT,
      territories: ["93"],
      country: CountryCodes.FR,
    };

    describe("POST /users/signup", () => {
      let userId: string | null = null;

      it(`✅ should create a new Solibot for the admin users - ${currentTestAccount}`, async () => {
        const response = await addAuth(
          supertest().post("/users/signup").send(testUser),
          currentTestAccount
        );

        if (currentTestAccount === TestAccounts.USER_ADMIN_TERRITORY) {
          successStatus = 400;
        }

        expect(response.status).toEqual(successStatus);

        if (response.status !== 200) return;

        userId = response.body;
        expect(userId).not.toBeUndefined();
        expect(userId).not.toBeNull();
        expect(mongoose.Types.ObjectId.isValid(userId!)).toEqual(true); // skipcq: JS-0339
      });

      afterEach(async () => {
        if (userId) {
          const user = await getUserByIdWithUserRights(userId);
          if (user) {
            await deleteUser(user);
          }
        }
      });
    });

    it(`❌ shouldn't create a new Solibot for anyone - ${currentTestAccount}`, async () => {
      const response = await addAuth(
        supertest().post("/users/signup").send({
          name: "Baz",
          mail: "baz",
          status: UserStatus.SOLI_BOT,
          country: CountryCodes.FR,
        }),
        currentTestAccount
      );

      expect(response.status).toEqual(failStatus);
    });

    describe("POST /admin/users/search", () => {
      let createdUser: UserPopulateType | null = null;
      beforeEach(async () => {
        createdUser = await signupWithoutInvitation({
          ...testUser,
          mail: `${getRandomString()}.${testUser.mail}`,
        });
        if (!createdUser) {
          fail("could not create user");
        }
      });

      it(`✅ should find the created Solibot for the admin users - ${currentTestAccount}`, async () => {
        const response = await addAuth(
          supertest()
            .post("/admin/users/search")
            .send({
              mail: createdUser!.mail, // skipcq: JS-0339
              context: UserSearchContext.MANAGE_PARTNERS,
              country: CountryCodes.FR,
              territories: [...DEPARTMENT_CODES.fr],
            }),
          currentTestAccount
        );

        if (currentTestAccount === TestAccounts.USER_ADMIN_TERRITORY) {
          // Admin territory can see Solibots users, but cannot create
          // Results will be 0 so we skip those tests
          return;
        }

        expect(response.status).toEqual(successStatus);

        if (response.status !== 200) return;

        expect(response.body.nbResults).toEqual(1);

        const foundUser = response.body.results[0];

        expect(foundUser.mail).toEqual(createdUser!.mail); // skipcq: JS-0339
        expect(foundUser.devToken).not.toBeUndefined();
        expect(foundUser.password).toBeUndefined();
      });

      afterEach(async () => {
        if (createdUser) {
          await deleteUser(createdUser);
        }
      });
    });

    describe("DELETE /admin/users/:id", () => {
      let createdUser: UserPopulateType | null = null;
      beforeEach(async () => {
        createdUser = await signupWithoutInvitation({
          ...testUser,
          mail: `${getRandomString()}.${testUser.mail}`,
        });
        if (!createdUser) {
          fail("Could not create user");
        }
      });

      it(`✅ should delete the created Solibot for the admin users - ${currentTestAccount}`, async () => {
        const userObjectId = createdUser!._id; // skipcq: JS-0339

        const response = await addAuth(
          supertest().delete(`/admin/users/${userObjectId}`),
          currentTestAccount
        );

        if (currentTestAccount === TestAccounts.USER_ADMIN_TERRITORY) {
          // Admin territory can see Solibots users, but cannot create
          // Results will be 0 so we skip those tests
          return;
        }
        expect(response.status).toEqual(successStatus);

        if (response.status !== 200) return;

        // prevent afterEach to run for nothing
        createdUser = null;
        expect(response.body.message).toEqual("USER_DELETED");

        const user = await getUserByIdWithUserRights(userObjectId);

        expect(user).toBeNull();
      });

      afterEach(async () => {
        if (createdUser) {
          await deleteUser(createdUser);
        }
      });
    });
  }
);
