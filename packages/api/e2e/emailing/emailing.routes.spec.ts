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
import { CAMPAIGN_DEFAULT_NAME, CountryCodes } from "@soliguide/common";

import { addAuth, getExpectedStatus, supertest } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

import EmailCampaignModel from "../../src/emailing/models/email-campaign.model";
import { updateUsers } from "../../src/user/services";

const ALLOWED_USERS_FOR_GENERATION = [TestAccounts.USER_ADMIN_SOLIGUIDE];
const ALLOWED_USERS_FOR_SEARCH = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

let nGeneratedEmails: number;
let nFoundEmails: number;

let currentIndex = 0;
const totalIterations = Object.values(TestAccounts).length;

describe.each(Object.values(TestAccounts))(
  "Test of the route 'emailing'",
  (currentAccountTest) => {
    nGeneratedEmails = 0;
    nFoundEmails = 0;

    describe(`POST /emailing/generate-campaign-emails ${currentAccountTest}`, () => {
      test("❌ Incorrect data", async () => {
        let response = await addAuth(
          supertest()
            .post("/emailing/generate-campaign-emails")
            .send({ emailType: "foo" }),
          currentAccountTest
        );

        // Failed test
        let expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_GENERATION,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);

        response = await addAuth(
          supertest()
            .post("/emailing/generate-campaign-emails")
            .send({ emailType: "CAMPAGNE_COMPTES_PRO", territories: "bar" }),
          currentAccountTest
        );

        // Failed test
        expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_GENERATION,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
      });

      test("✅ First emails wave generation for pro users", async () => {
        const response = await addAuth(
          supertest()
            .post("/emailing/generate-campaign-emails")
            .send({
              emailType: "CAMPAGNE_COMPTES_PRO",
              territories: ["75"],
              country: CountryCodes.FR,
            }),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_GENERATION,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        if (response.status === 200) {
          nGeneratedEmails = response.body;
        }

        expect(response.status).toEqual(expectedStatus);
      });
    });

    describe(`POST /emailing/search ${currentAccountTest}`, () => {
      test("❌ Incorrect data", async () => {
        const response = await addAuth(
          supertest().post("/emailing/search").send({ territories: "foo" }),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_SEARCH,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
      });

      test("✅ Search for emails in the first email wave for pro users", async () => {
        const response = await addAuth(
          supertest()
            .post("/emailing/search")
            .send({
              emailType: "CAMPAGNE_COMPTES_PRO",
              territories: ["75"],
              country: CountryCodes.FR,
            }),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_SEARCH,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);

        if (response.status === 200) {
          nFoundEmails = response.body.nbResults;
        }

        expect(nFoundEmails).toBe(nGeneratedEmails);
      });
    });

    afterAll(async () => {
      currentIndex++;
      if (currentIndex === totalIterations) {
        await EmailCampaignModel.deleteMany({});
        await updateUsers(
          {
            [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_COMPTES_PRO.ready`]:
              true,
          },
          {
            $set: {
              [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_COMPTES_PRO.ready`]:
                false,
            },
          },
          false
        );
      }
    });
  }
);
