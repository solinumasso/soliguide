import { CREATE_ORGA_OK_SIMPLE } from "./bodies/CREATE_ORGA.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_OWNER,
];

describe.each(Object.values(TestAccounts))(
  "Organization admin test - PATCH",
  (currentAccountTest) => {
    // Successful test
    const expectedStatus = getExpectedStatus(
      ALLOWED_USERS,
      currentAccountTest,
      ExpectedStatus.SUCCESS
    );

    describe(`PATCH /organizations/6190169415b4826bc9d6af71 ${currentAccountTest}`, () => {
      test(`✅ PATCH /organizations/6190169415b4826bc9d6af71 - \t${expectedStatus}`, async () => {
        const patchOrga = { ...CREATE_ORGA_OK_SIMPLE };
        patchOrga.description = "New Description";
        const response = await addAuth(
          supertest()
            .patch("/organizations/6190169415b4826bc9d6af71")
            .send(patchOrga),
          currentAccountTest
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.organization_id).toEqual(expect.any(Number));
        expect(response.body.name).toEqual("Orga de test");
      });

      test(`❌ PATCH /organizations/6190169415b4826bc9d6af71 - \t${expectedStatus}`, async () => {
        const CREATE_ORGA_FAIL = { ...CREATE_ORGA_OK_SIMPLE };
        CREATE_ORGA_FAIL.name = ["555555"] as any;

        const response = await addAuth(
          supertest()
            .patch("/organizations/6190169415b4826bc9d6af71")
            .send(CREATE_ORGA_FAIL),
          currentAccountTest
        );
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
