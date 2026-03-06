import {
  ITINERARY_PUBLIC_SEARCH_CITY_OK,
  PUBLIC_SEARCH_CITY_OK,
  PUBLIC_SEARCH_MULTIPLE_CATEGORIES_OK,
  PUBLIC_SEARCH_OPEN_TODAY_OK,
  PUBLIC_SEARCH_POSITION_OK,
} from "./bodies/PUBLIC_SEARCH.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

import { slugLocation } from "@soliguide/common";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_API_ALIMENTATION,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_API_DEFAULT,
  TestAccounts.USER_API_PARIS,
  TestAccounts.USER_PRO_EDITOR,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
  TestAccounts.USER_PRO_READER,
  TestAccounts.USER_TRANSLATOR_EN_AR,
];

const CAN_SEE_DRAFT = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

const CAN_SEARCH_WITH_MULTIPLE_CATEGORIES = [
  TestAccounts.USER_API_ALIMENTATION,
  TestAccounts.USER_API_DEFAULT,
  TestAccounts.USER_API_PARIS,
];

jest.mock(
  "../../src/middleware/logging/services/log-search-query.service",
  () => {
    return {
      logSearchQuery: () =>
        new Promise<void>((resolve) => {
          resolve();
        }),
    };
  }
);

const checkValidResponse = async (
  route: string,
  currentAccountTest: TestAccounts,
  body: any,
  allowedUsersToRequest = ALLOWED_USERS,
  allowedUsersToGetResponse = ALLOWED_USERS
) => {
  const response = await addAuth(
    supertest().post(route).send(body),
    currentAccountTest
  );

  const expectedStatus = getExpectedStatus(
    allowedUsersToRequest,
    currentAccountTest,
    allowedUsersToGetResponse.includes(currentAccountTest)
      ? ExpectedStatus.SUCCESS
      : ExpectedStatus.FAIL
  );

  expect(response.status).toEqual(expectedStatus);

  if (
    (expectedStatus === 403 && response.status === 403) ||
    (expectedStatus === 400 && response.status === 400)
  ) {
    return;
  }

  expect(response.body.nbResults).toBeGreaterThan(0);
  expect(response.body.places).toBeDefined();

  return response;
};

describe.each(Object.values(TestAccounts))(
  "Test search",
  (currentAccountTest) => {
    describe(`POST /new-search - BY GPS POSITION - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        await checkValidResponse(
          "/new-search",
          currentAccountTest,
          PUBLIC_SEARCH_POSITION_OK
        );
      });
    });

    describe(`POST /new-search - BY CITY - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        const response = await checkValidResponse(
          "/new-search",
          currentAccountTest,
          PUBLIC_SEARCH_CITY_OK
        );

        if (!response) {
          return;
        }

        expect(slugLocation(response.body.places[0].position.city)).toEqual(
          PUBLIC_SEARCH_CITY_OK.location.geoValue
        );
      });
    });

    describe(`POST /new-search - BY FILTERING OPENING STATUS - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        const response = await checkValidResponse(
          "/new-search",
          currentAccountTest,
          PUBLIC_SEARCH_OPEN_TODAY_OK
        );

        if (!response) {
          return;
        }

        expect(
          response.body.places.reduce((value: boolean, place: any) => {
            if (!value && place.name === "LIEU_BROUILLON") {
              value = true;
            }
            return value;
          }, false)
        ).toBe(CAN_SEE_DRAFT.includes(currentAccountTest));
      });
    });

    describe(`POST /new-search - SEARCH ON MOBILE SERVICES BY CITY - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        await checkValidResponse(
          "/new-search",
          currentAccountTest,
          ITINERARY_PUBLIC_SEARCH_CITY_OK
        );
      });
    });

    describe(`POST /new-search/en - BY CITY AND SEARCH RESULTS IN ENGLISH - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        await checkValidResponse(
          "/new-search/en",
          currentAccountTest,
          PUBLIC_SEARCH_CITY_OK
        );
      });
    });

    describe(`POST /new-search/en - BY CITY AND WITH MULTIPLE CATEGORIES - ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        const response = await checkValidResponse(
          "/new-search/en",
          currentAccountTest,
          PUBLIC_SEARCH_MULTIPLE_CATEGORIES_OK,
          ALLOWED_USERS,
          CAN_SEARCH_WITH_MULTIPLE_CATEGORIES
        );

        if (!response) {
          return;
        }

        expect(
          response.body.places[0].services_all.reduce(
            (value: boolean, service: any) => {
              if (
                !value &&
                PUBLIC_SEARCH_MULTIPLE_CATEGORIES_OK.categories.includes(
                  service.category
                )
              ) {
                value = true;
              }
              return value;
            },
            false
          )
        ).toBe(
          CAN_SEARCH_WITH_MULTIPLE_CATEGORIES.includes(currentAccountTest)
        );
      });
    });
  }
);
