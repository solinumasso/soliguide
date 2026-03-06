import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";
import { CategoriesService } from "@soliguide/common";
import { TypeCategoriesServiceNotFromThemeEnum } from "../../src/categories/enums/type-categories-service-not-from-theme.enum";
import { getServiceCategoriesApi } from "../../src/categories/functions/get-service-categories-api.function";

const ALLOWED_USERS_FOR_CATEGORIES = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_API_DEFAULT,
  TestAccounts.USER_API_PARIS,
  TestAccounts.USER_API_ALIMENTATION,
];

let serviceCategoriesApi: CategoriesService;
beforeAll(() => {
  serviceCategoriesApi = getServiceCategoriesApi(
    TypeCategoriesServiceNotFromThemeEnum.V2
  );
});

describe.each(Object.values(TestAccounts))(
  "Tests of the route 'v2'",
  (currentAccountTest) => {
    describe(`GET /v2/categories ${currentAccountTest}`, () => {
      test("✅ Return the categories", async () => {
        const response = await addAuth(
          supertest().get("/v2/categories"),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS_FOR_CATEGORIES,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);

        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toStrictEqual(
          serviceCategoriesApi.getCategoriesTreeNode()
        );
      });
    });
  }
);
