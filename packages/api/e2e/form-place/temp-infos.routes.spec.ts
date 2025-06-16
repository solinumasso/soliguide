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
import { TempInfoType } from "@soliguide/common";

import { addAuth, getExpectedStatus, supertest } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

import { deleteTempInfoByParams } from "../../src/temp-info/services/temp-info.service";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

// Do not call location-api
jest.mock("../../src/search/services/location-api.service");

describe("Testing temporary information", () => {
  beforeAll(() => {
    jest.useFakeTimers({ doNotFake: ["nextTick"] });
    jest.setSystemTime(new Date("2022-08-08T01:00:00.000Z"));
  });

  afterAll(async () => {
    await deleteTempInfoByParams({ placeId: 11 });
  });

  describe.each(Object.values(TestAccounts))(
    "PATCH /temp-infos/closure",
    (currentAccountTest) => {
      test(`❌ Incorrect data ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().patch("/temp-infos/closure/11").send({
            _id: null,
            dateDebut: "xxx",
            description: "This description",
          }),
          currentAccountTest
        );

        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
      });

      let tempInfoId: string | null = null;

      const createTemporaryClosure = async () => {
        tempInfoId = null;
        const response = await addAuth(
          supertest().patch("/temp-infos/closure/11").send({
            _id: null,
            dateDebut: "2022-09-19T00:00:00.000Z",
            dateFin: null,
            description: "<p><strong>A valid temporary closure</strong></p>",
          }),
          currentAccountTest
        );

        tempInfoId =
          response.body.tempInfo != null
            ? response.body.tempInfo[0]?._id
            : null;
        return response;
      };

      const deleteTemporaryClosure = async (testAccount: TestAccounts) =>
        await addAuth(
          supertest().delete(`/temp-infos/closure/11/${tempInfoId}`),
          testAccount
        );

      afterEach(async () => await deleteTemporaryClosure(ALLOWED_USERS[0]));

      test(`✅ Create temporary closure - ${currentAccountTest}`, async () => {
        const response = await createTemporaryClosure();

        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);

        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const tempInfo = response.body.tempInfo[0];

        expect(tempInfo.name).toEqual(null);
        expect(tempInfo.dateFin).toEqual(null);
        expect(tempInfo.nbDays).toEqual(null);
        expect(tempInfo.tempInfoType).toEqual(TempInfoType.CLOSURE);
        expect(tempInfo.description).toBeTruthy();
      });

      test(`✅ Edit the created temporary closure - ${currentAccountTest}`, async () => {
        await createTemporaryClosure();
        const response = await addAuth(
          supertest().patch("/temp-infos/closure/11").send({
            _id: tempInfoId,
            dateDebut: "2022-09-15T12:20:00.000Z",
            dateFin: "2022-09-17T10:30:00.000Z",
            description: "A new test",
          }),
          currentAccountTest
        );

        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);

        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const tempInfo = response.body.tempInfo[0];

        expect(tempInfo.name).toEqual(null);
        expect(tempInfo.nbDays).toEqual(3);
        expect(tempInfo.dateFin).toEqual("2022-09-17T23:59:59.000Z");
        expect(tempInfo.tempInfoType).toEqual(TempInfoType.CLOSURE);
        expect(tempInfo.description).toEqual("A new test");
      });

      test(`✅ Delete the created temporary closure - ${currentAccountTest}`, async () => {
        await createTemporaryClosure();
        const response = await deleteTemporaryClosure(currentAccountTest);

        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);

        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.place).toBeTruthy();
        expect(response.body.place.lieu_id).toEqual(11);
        expect(response.body.tempInfo.length).toEqual(0);
      });
    }
  );
});
