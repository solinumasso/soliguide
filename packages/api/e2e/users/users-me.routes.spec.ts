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
import { SupportedLanguagesCode, UserStatus } from "@soliguide/common";

import { ACCOUNTS_FOR_TEST } from "../USERS_FOR_TEST.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

import { User } from "../../src/_models";

import { UserModel } from "../../src/user/models/user.model";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_EDITOR,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
  TestAccounts.USER_PRO_READER,
  TestAccounts.USER_TRANSLATOR_EN_AR,
];

const baseUrl = "/users/me";

describe.each(Object.values(TestAccounts))(
  `Tests of the route '${baseUrl}'`,
  (currentAccountTest) => {
    const expectedStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentAccountTest,
      ExpectedStatus.SUCCESS
    );
    const failStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentAccountTest,
      ExpectedStatus.FAIL
    );
    const getUser = async () => {
      return await addAuth(supertest().get(baseUrl), currentAccountTest);
    };

    describe(`GET ${baseUrl}`, () => {
      test(`✅ Correct token ${currentAccountTest}`, async () => {
        const response = await getUser();

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
      });
    });

    describe(`PATCH ${baseUrl}`, () => {
      const patchUser = async (body: Partial<User>) => {
        return await addAuth(
          supertest().patch(baseUrl).send(body),
          currentAccountTest
        );
      };

      let userData = {};
      let userId: number;

      // Use beforeAll instead of beforeEach - data is fetched once per account instead of before each test
      beforeAll(async () => {
        const response = await getUser();

        userId = response.body.user_id;

        userData = {
          languages: response.body.languages,
          lastname: response.body.lastname,
          name: response.body.name,
          status: response.body.status,
          title: response.body.title,
          translator: response.body.translator,
        };
      });

      afterEach(async () => {
        await UserModel.updateOne({ user_id: userId }, { $set: userData });
      });

      test(`✅ Patch user - ${currentAccountTest}`, async () => {
        const response = await patchUser({
          lastname: "newLastname",
          name: "newName",
          title: "newTitle",
        });

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.lastname).toStrictEqual("newLastname");
        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
        expect(response.body.name).toStrictEqual("newName");
        expect(response.body.title).toStrictEqual("newTitle");
      });

      test(`✅ Patch user's territories - ${currentAccountTest}`, async () => {
        const userBeforeUpdate = await getUser();

        const response = await patchUser({
          name: "newName",
          lastname: "newLastname",
          territories: ["01", "02", "93"],
          title: "newTitle",
        });

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.lastname).toStrictEqual("newLastname");
        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
        expect(response.body.name).toStrictEqual("newName");
        expect(response.body.title).toStrictEqual("newTitle");

        expect(response.body.areas).toEqual(userBeforeUpdate.body.areas);
      });

      test(`✅ Patch user's status - ${currentAccountTest}`, async () => {
        const newStatus =
          currentAccountTest === TestAccounts.USER_ADMIN_SOLIGUIDE
            ? UserStatus.ADMIN_TERRITORY
            : UserStatus.ADMIN_SOLIGUIDE;
        const response = await patchUser({
          lastname: "newLastname",
          name: "newName",
          status: newStatus,
          title: "newTitle",
        });

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.lastname).toStrictEqual("newLastname");
        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
        expect(response.body.name).toStrictEqual("newName");
        expect(response.body.status).not.toStrictEqual(newStatus);
        expect(response.body.title).toStrictEqual("newTitle");
      });

      test(`✅ Patch user's email - ${currentAccountTest}`, async () => {
        const response = await patchUser({
          lastname: "newLastname",
          mail: "foo@bar.com",
          name: "newName",
          title: "newTitle",
        });

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.lastname).toStrictEqual("newLastname");
        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
        expect(response.body.name).toStrictEqual("newName");
        expect(response.body.title).toStrictEqual("newTitle");
      });

      test(`✅ Patch user's languages - ${currentAccountTest}`, async () => {
        const response = await patchUser({
          languages: [SupportedLanguagesCode.EN],
          lastname: "newLastname",
          name: "newName",
          title: "newTitle",
          translator: true,
        });

        expect(response.status).toEqual(expectedStatus);
        if (response.status === 403) {
          return;
        }

        expect(response.body.languages).toEqual(["en"]);
        expect(response.body.lastname).toStrictEqual("newLastname");
        expect(response.body.mail).toStrictEqual(
          ACCOUNTS_FOR_TEST[currentAccountTest]
        );
        expect(response.body.name).toStrictEqual("newName");
        expect(response.body.password).toBeUndefined();
        expect(response.body.passwordToken).toBeUndefined();
        expect(response.body.title).toStrictEqual("newTitle");
        expect(response.body.translator).toBeTruthy();
      });

      test(`❌ Patch translator with no language - ${currentAccountTest}`, async () => {
        const response = await patchUser({
          lastname: "newLastname",
          name: "newName",
          title: "newTitle",
          translator: true,
        });

        expect(response.status).toEqual(failStatus);
      });

      test(`❌ Patch bad language - ${currentAccountTest}`, async () => {
        const response = await patchUser({
          // @ts-expect-error - only languages in 'SupportedLanguagesCode' are expected here
          languages: ["XX"],
          lastname: "newLastname",
          name: "newName",
          title: "newTitle",
          translator: true,
        });

        expect(response.status).toEqual(failStatus);
      });
    });
  }
);

test("❌ Incorrect token", async () => {
  await supertest()
    .get(baseUrl)
    .set("Authorization", "JWT it won't work")
    .expect(401)
    .expect("Content-Type", /json/)
    .then((response) => {
      expect(response.body.message).toStrictEqual("INVALID_TOKEN");
    });
});

test("❌ Nonexisting token", async () => {
  await supertest()
    .get(baseUrl)
    .set("Origin", "https://soliguide.fr")
    .expect(401)
    .expect("Content-Type", /json/)
    .then((response) => {
      expect(response.body.message).toStrictEqual("NOT_LOGGED");
    });
});
