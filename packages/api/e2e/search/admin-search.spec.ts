import {
  ADMIN_SEARCH_PLACE_AND_CATEGORY_OK,
  ADMIN_SEARCH_ITINERARY_AND_POSITION_OK,
} from "./bodies/ADMIN_SEARCH.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

jest.mock(
  "../../src/middleware/logging/services/log-search-query.service",
  () => {
    return {
      logSearchQuery: () => {
        return Promise.resolve(null);
      },
    };
  }
);

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

describe.each(Object.values(TestAccounts))(
  "Test admin search",
  (currentAccountTest) => {
    describe("POST /new-search/admin-search - Search places by service (1302)", () => {
      test("✅ Correct data " + currentAccountTest, async () => {
        const response = await addAuth(
          supertest()
            .post("/new-search/admin-search")
            .send(ADMIN_SEARCH_PLACE_AND_CATEGORY_OK),
          currentAccountTest
        );

        // Success test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.nbResults).toBeGreaterThan(1);
        expect(response.body.places).toBeDefined();
      });
    });

    describe("POST /new-search/admin-search - Search itineraries by position", () => {
      test(`✅ Correct data ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .post("/new-search/admin-search")
            .send(ADMIN_SEARCH_ITINERARY_AND_POSITION_OK),
          currentAccountTest
        );

        // Success test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.nbResults).toBeGreaterThanOrEqual(1);
        expect(response.body.places).toBeDefined();
      });
    });
  }
);
