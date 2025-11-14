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
import request from "supertest";

import {
  AuthTokens,
  TestAccounts,
  ExpectedStatus,
} from "./endPointTester.type";
import { ACCOUNTS_FOR_TEST } from "./USERS_FOR_TEST.const";

import { app } from "../src/app";

const authTokens: AuthTokens = Object.values(TestAccounts).reduce(
  (tokens, user) => {
    tokens[user] = null;
    return tokens;
  },
  {} as AuthTokens
);

export const supertest = () => request(app);

export const addAuth = async (client: request.Test, user: TestAccounts) => {
  await loginForTest(user);
  client.set("Authorization", `JWT ${authTokens[user]}`);

  if (user.includes("API")) {
    client.set("Origin", "someOtherWebsite");
  } else {
    client.set("Origin", "https://soliguide.fr");
  }
  return client;
};

/**
 *
 * @param {Array} allowedUsers Users allowed to use this endpoint
 * @param {TestAccounts} user User in use
 * @param {ExpectedStatus} status
 * @returns {number}
 */
export const getExpectedStatus = (
  allowedUsers: TestAccounts[],
  user: TestAccounts,
  status: ExpectedStatus
): number => {
  if (!user.includes("API") && status === ExpectedStatus.NOT_FOUND) {
    return 404;
  }

  if (allowedUsers.indexOf(user) !== -1) {
    switch (status) {
      case ExpectedStatus.SUCCESS:
        return 200;
      case ExpectedStatus.ERROR:
        return 500;
      case ExpectedStatus.PROCESSING:
        return 202;
      default:
        return 400;
    }
  }
  return 403;
};

export const loginForTest = async (user: TestAccounts) => {
  if (authTokens[user] !== null) {
    return;
  }
  const response = await supertest()
    .post("/users/signin")
    .set("Origin", "https://soliguide.fr")
    .send({
      mail: ACCOUNTS_FOR_TEST[user],
      password: "soliguide",
    });

  if (response.status === 400) {
    authTokens[user] = null;
  } else {
    authTokens[user] = response.body.token;
  }
};
