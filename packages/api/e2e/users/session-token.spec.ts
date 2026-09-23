import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { PUBLIC_SEARCH_CITY_OK } from "../search/bodies/PUBLIC_SEARCH.const";

import { supertest, getSetCookieHeader } from "../endPointTester";
import { TestAccounts } from "../endPointTester.type";
import { ACCOUNTS_FOR_TEST } from "../USERS_FOR_TEST.const";

import { CONFIG } from "../../src/_models";
import { UserModel } from "../../src/user/models/user.model";

jest.mock(
  "../../src/middleware/logging/services/log-search-query.service",
  () => {
    return {
      logSearchQuery: () => Promise.resolve(null),
    };
  }
);

const SOLIGUIDE_ORIGIN = "https://soliguide.fr";
const PUBLIC_ROUTE = "/new-search";
const AUTH_STATUS_ROUTE = "/users/me";

const PRO_OWNER_MAIL = ACCOUNTS_FOR_TEST[TestAccounts.USER_PRO_OWNER];

const sessionCookie = (token: string): string =>
  `${CONFIG.AUTH_COOKIE_NAME}=${token}`;

const searchWithCookie = (cookie: string) =>
  supertest()
    .post(PUBLIC_ROUTE)
    .set("Origin", SOLIGUIDE_ORIGIN)
    .set("Cookie", cookie)
    .send(PUBLIC_SEARCH_CITY_OK);

const getMeWithCookie = (cookie: string) =>
  supertest()
    .get(AUTH_STATUS_ROUTE)
    .set("Origin", SOLIGUIDE_ORIGIN)
    .set("Cookie", cookie);

const getMeWithAuthorizationHeader = (token: string) =>
  supertest()
    .get(AUTH_STATUS_ROUTE)
    .set("Origin", SOLIGUIDE_ORIGIN)
    .set("Authorization", `JWT ${token}`);

describe("Session token", () => {
  describe("Cookie carrying a token that cannot be verified", () => {
    const unverifiableCookie = sessionCookie("this-is-not-a-jwt");

    test("✅ A public route stays available", async () => {
      const response = await searchWithCookie(unverifiableCookie);

      expect(response.status).toEqual(200);
      expect(response.body.places).toBeDefined();
    });

    test("✅ The response clears the unusable cookie", async () => {
      const response = await searchWithCookie(unverifiableCookie);

      expect(getSetCookieHeader(response).join(";")).toContain(
        `${CONFIG.AUTH_COOKIE_NAME}=;`
      );
    });

    test("✅ The visitor is anonymous, not rejected", async () => {
      const response = await getMeWithCookie(unverifiableCookie).expect(401);

      expect(response.body.message).toStrictEqual("NOT_LOGGED");
    });
  });

  describe("Cookie carrying a valid token of a user that no longer exists", () => {
    const deletedUserCookie = sessionCookie(
      jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString() },
        CONFIG.JWT_SECRET
      )
    );

    test("✅ A public route stays available", async () => {
      const response = await searchWithCookie(deletedUserCookie);

      expect(response.status).toEqual(200);
      expect(response.body.places).toBeDefined();
    });

    test("✅ The response clears the unusable cookie", async () => {
      const response = await searchWithCookie(deletedUserCookie);

      expect(getSetCookieHeader(response).join(";")).toContain(
        `${CONFIG.AUTH_COOKIE_NAME}=;`
      );
    });
  });

  describe("Authorization header carrying an unusable token", () => {
    test("❌ An unverifiable token is rejected with INVALID_TOKEN", async () => {
      const response = await getMeWithAuthorizationHeader(
        "this-is-not-a-jwt"
      ).expect(401);

      expect(response.body.message).toStrictEqual("INVALID_TOKEN");
    });

    test("❌ A token of a user that no longer exists is rejected with USER_NOT_VERIFIED", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString() },
        CONFIG.JWT_SECRET
      );

      const response = await getMeWithAuthorizationHeader(token).expect(401);

      expect(response.body.message).toStrictEqual("USER_NOT_VERIFIED");
    });
  });

  describe("Expired token", () => {
    let expiredToken: string;

    beforeAll(async () => {
      const proOwner = await UserModel.findOne({ mail: PRO_OWNER_MAIL });

      expiredToken = jwt.sign(
        { _id: proOwner!._id.toString() },
        CONFIG.JWT_SECRET,
        { expiresIn: "-1h" }
      );
    });

    // Integration tokens (`createDevToken`) are never renewed, so an expired one must
    // keep working when it is passed in the Authorization header.
    test("✅ Accepted in the Authorization header", async () => {
      const response = await getMeWithAuthorizationHeader(expiredToken).expect(
        200
      );

      expect(response.body.mail).toStrictEqual(PRO_OWNER_MAIL);
    });

    // A browser session, on the other hand, really expires.
    test("✅ Refused in a session cookie, and the cookie is cleared", async () => {
      const response = await getMeWithCookie(
        sessionCookie(expiredToken)
      ).expect(401);

      expect(response.body.message).toStrictEqual("NOT_LOGGED");
      expect(getSetCookieHeader(response).join(";")).toContain(
        `${CONFIG.AUTH_COOKIE_NAME}=;`
      );
    });
  });
});
