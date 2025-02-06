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
import {
  CREATE_ORGA_OK_SIMPLE,
  CREATE_ORGA_OK_COMPLETE,
} from "./bodies/CREATE_ORGA.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

describe.each(Object.values(TestAccounts))(
  "Organization admin test - POST",
  (currentAccountTest) => {
    describe(`✅ POST /organizations ${currentAccountTest}`, () => {
      test("✅ Basic information", async () => {
        const response = await addAuth(
          supertest().post("/organizations").send(CREATE_ORGA_OK_SIMPLE),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );
        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.organization_id).toEqual(expect.any(Number));
        expect(response.body.name).toEqual("Orga de test");
      });

      test("✅ More information saved", async () => {
        const response = await addAuth(
          supertest().post("/organizations").send(CREATE_ORGA_OK_COMPLETE),
          currentAccountTest
        );
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );
        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.organization_id).toEqual(expect.any(Number));
        expect(response.body.description).toEqual(
          "Amet fugiat ullamco do magna cillum nulla. Et duis mollit aliqua consectetur laborum anim anim mollit aliquip. Sint ex veniam in voluptate ipsum amet proident anim nulla proident ullamco ullamco labore magna."
        );
        expect(response.body.name).toEqual("Organisation sans aucun soucis");
      });

      test("❌ Wrong territory", async () => {
        const CREATE_ORGA_FAIL = { ...CREATE_ORGA_OK_COMPLETE };
        CREATE_ORGA_FAIL.territories = ["555555"] as any;

        const response = await addAuth(
          supertest().post("/organizations").send(CREATE_ORGA_FAIL),
          currentAccountTest
        );
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.FAIL
        );
        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.length).toBeGreaterThan(0);
      });

      test("❌ Wrong name", async () => {
        const CREATE_ORGA_FAIL = {
          ...CREATE_ORGA_OK_COMPLETE,
          name: undefined,
        };

        const response = await addAuth(
          supertest().post("/organizations").send(CREATE_ORGA_FAIL),
          currentAccountTest
        );
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.FAIL
        );
        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.length).toBeGreaterThan(0);
      });
    });
  }
);
