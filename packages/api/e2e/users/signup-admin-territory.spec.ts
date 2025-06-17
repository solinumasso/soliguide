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

import { CountryCodes, UserSearchContext, UserStatus } from "@soliguide/common";

import { addAuth, getExpectedStatus, supertest } from "../endPointTester";
import { ExpectedStatus, TestAccounts } from "../endPointTester.type";

import { deleteUser } from "../../src/user/controllers/user-admin.controller";
import { getUserByIdWithUserRights } from "../../src/user/services";
import { signupWithoutInvitation } from "../../src/user/controllers/user.controller";
import get from "lodash.get";

import { SignupUser, User, UserPopulateType } from "../../src/user/interfaces";

const ALLOWED_USERS = [TestAccounts.USER_ADMIN_SOLIGUIDE];

// const getRandomString = () => (Math.random() + 1).toString(36).substring(7);

describe.each(Object.values(TestAccounts))(
  "Should signup 'ADMIN_TERRITORY' in routes /users/signup, /admin/users/search/ and /admin/users/delete/?userObjectId",
  (currentTestAccount) => {
    let successStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentTestAccount,
      ExpectedStatus.SUCCESS
    );

    let failStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentTestAccount,
      ExpectedStatus.FAIL
    );

    const testUser: SignupUser = {
      name: "Admin",
      lastname: "Territory",
      mail: `${currentTestAccount}.foo.bar.spain@soliguia.es`,
      status: UserStatus.ADMIN_TERRITORY,
      territories: ["08"], // barcelona
      country: CountryCodes.ES,
    };

    describe("POST /users/signup", () => {
      let userId: string | null = null;

      it(`✅ should create a new Admin Territory for Spain (Barcelona) - ${currentTestAccount}`, async () => {
        testUser.territories = ["08"]; // Barcelona 08

        const response = await addAuth(
          supertest().post("/users/signup").send(testUser),
          currentTestAccount
        );

        // Admin territory can add user, but only in his territory
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

      it(`🔴 should not create a new Admin Territory for an unknown territory - ${currentTestAccount}`, async () => {
        testUser.territories = ["9090909"] as any; // Fake territory
        const response = await addAuth(
          supertest().post("/users/signup").send(testUser),
          currentTestAccount
        );

        // Admin territory can add user, but only in his territory
        if (currentTestAccount === TestAccounts.USER_ADMIN_TERRITORY) {
          failStatus = 400;
        }
        expect(response.status).toEqual(failStatus);
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

    describe("POST /admin/users/search", () => {
      let createdUser: UserPopulateType | null = null;
      beforeEach(async () => {
        createdUser = await signupWithoutInvitation({
          ...testUser,

          mail: `spanish-admin-territory@soliguia.es`,
          territories: ["08"], // barcelona
          country: CountryCodes.ES,
        });
        if (!createdUser) {
          fail("could not create user");
        }
      });
      it(`Should find ADMIN_TERRITORY user from Spain only if ADMIN_SOLIGUIDE - ${currentTestAccount}`, async () => {
        const response = await addAuth(
          supertest()
            .post("/admin/users/search")
            .send({
              context: UserSearchContext.MANAGE_USERS,
              country: CountryCodes.ES,
              territories: ["08"],
              mail: `spanish-admin-territory@soliguia.es`,
            }),
          currentTestAccount
        );

        expect(response.status).toEqual(successStatus);

        if (response.status !== 200) return;

        expect(response.body.results.length).toEqual(1);
        const firstResult: Partial<User> = response.body.results[0];
        const areasDepartments = get(firstResult, "areas.es.departments");
        expect(areasDepartments).toEqual(["08"]);
      });

      afterEach(async () => {
        if (createdUser) {
          await deleteUser(createdUser);
        }
      });
    });
  }
);
