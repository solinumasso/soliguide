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

import type { ExpressRequest, ExpressResponse } from "../../../_models";
import { updateLastLogin } from "../update-last-login.middleware";
import * as usersService from "../../services/users.service";
import * as organizationService from "../../../organization/services/organization.service";
import {
  MOCK_USER_NOT_LOGGED,
  MOCK_USER_LOGGED,
  createMockRequest,
  createMockResponse,
  getYesterdayDate,
  getLastYearDate,
  getLastMonthDate,
  MOCK_USER_ID,
  MOCK_ORG_ID,
} from "./UPDATE_LAST_LOGIN.mock";

jest.mock("../../services/users.service");
jest.mock("../../../organization/services/organization.service");

describe("updateLastLogin middleware", () => {
  let req: Partial<ExpressRequest>;
  let res: Partial<ExpressResponse>;
  let next: jest.Mock;
  let mockUpdateUser: jest.SpyInstance;
  let mockUpdateOrga: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateUser = jest.spyOn(usersService, "updateUser");
    mockUpdateOrga = jest.spyOn(organizationService, "updateOrga");

    next = jest.fn();
    req = createMockRequest() as Partial<ExpressRequest>;
    res = createMockResponse();
  });

  describe("when user is not logged in", () => {
    it("should skip lastLogin update and call next", async () => {
      req.user = MOCK_USER_NOT_LOGGED;

      await updateLastLogin(
        req as ExpressRequest,
        res as ExpressResponse,
        next
      );

      expect(req.log?.debug).toHaveBeenCalledWith(
        "User not logged in, skipping lastLogin update"
      );
      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(mockUpdateOrga).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("when user is logged in", () => {
    describe("user lastLogin", () => {
      it("should update lastLogin when user has never logged in before", async () => {
        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: null,
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.info).toHaveBeenCalledWith(
          { userId: MOCK_USER_ID, currentLastLogin: null },
          "Updating user lastLogin"
        );
        expect(mockUpdateUser).toHaveBeenCalledWith(
          { _id: MOCK_USER_ID },
          { lastLogin: expect.any(Date) },
          undefined,
          false
        );
        expect(next).toHaveBeenCalled();
      });

      it("should update lastLogin when last login was on a different day", async () => {
        const yesterday = getYesterdayDate();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: yesterday,
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.info).toHaveBeenCalledWith(
          { userId: MOCK_USER_ID, currentLastLogin: yesterday },
          "Updating user lastLogin"
        );
        expect(mockUpdateUser).toHaveBeenCalledWith(
          { _id: MOCK_USER_ID },
          { lastLogin: expect.any(Date) },
          undefined,
          false
        );
        expect(next).toHaveBeenCalled();
      });

      it("should not update lastLogin when user already logged in today", async () => {
        const now = new Date();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: now,
        } as typeof MOCK_USER_LOGGED;

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.debug).toHaveBeenCalledWith(
          { userId: MOCK_USER_ID, lastLogin: now },
          "User lastLogin already updated today"
        );
        expect(mockUpdateUser).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it("should update lastLogin when last login was at different year", async () => {
        const lastYear = getLastYearDate();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: lastYear,
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateUser).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it("should update lastLogin when last login was at different month", async () => {
        const lastMonth = getLastMonthDate();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: lastMonth,
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateUser).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it("should continue even if updateUser fails", async () => {
        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: null,
        } as typeof MOCK_USER_LOGGED;

        const error = new Error("Database error");
        mockUpdateUser.mockRejectedValue(error);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.error).toHaveBeenCalledWith(
          error,
          "Error updating lastLogin"
        );
        expect(next).toHaveBeenCalled();
      });
    });

    describe("organization lastLogin", () => {
      it("should update organization lastLogin when user has organizations", async () => {
        const now = new Date();
        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: now,
          organizations: [{ _id: MOCK_ORG_ID, lastLogin: null }],
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);
        mockUpdateOrga.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.info).toHaveBeenCalledWith(
          { orgId: MOCK_ORG_ID, currentLastLogin: null },
          "Updating organization lastLogin"
        );
        expect(mockUpdateOrga).toHaveBeenCalledWith(
          { _id: MOCK_ORG_ID },
          { lastLogin: expect.any(Date) }
        );
        expect(next).toHaveBeenCalled();
      });

      it("should not update organization lastLogin when already updated today", async () => {
        const now = new Date();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: now,
          organizations: [{ _id: MOCK_ORG_ID, lastLogin: now }],
        } as typeof MOCK_USER_LOGGED;

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(req.log?.debug).toHaveBeenCalledWith(
          { orgId: MOCK_ORG_ID, lastLogin: now },
          "Organization lastLogin already updated today"
        );
        expect(mockUpdateOrga).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it("should not update organization when user has no organizations", async () => {
        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: null,
          organizations: [],
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateOrga).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it("should not update organization when selectedOrgaIndex is undefined", async () => {
        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: null,
          organizations: [{ _id: MOCK_ORG_ID, lastLogin: null }],
          selectedOrgaIndex: undefined,
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateOrga).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });

    describe("both user and organization updates", () => {
      it("should update both user and organization when needed", async () => {
        const yesterday = getYesterdayDate();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: yesterday,
          organizations: [{ _id: MOCK_ORG_ID, lastLogin: yesterday }],
        } as typeof MOCK_USER_LOGGED;

        mockUpdateUser.mockResolvedValue(undefined);
        mockUpdateOrga.mockResolvedValue(undefined);

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateUser).toHaveBeenCalledWith(
          { _id: MOCK_USER_ID },
          { lastLogin: expect.any(Date) },
          undefined,
          false
        );
        expect(mockUpdateOrga).toHaveBeenCalledWith(
          { _id: MOCK_ORG_ID },
          { lastLogin: expect.any(Date) }
        );
        expect(next).toHaveBeenCalled();
      });

      it("should not update either when both were updated today", async () => {
        const now = new Date();

        req.user = {
          ...MOCK_USER_LOGGED,
          lastLogin: now,
          organizations: [{ _id: MOCK_ORG_ID, lastLogin: now }],
        } as typeof MOCK_USER_LOGGED;

        await updateLastLogin(
          req as ExpressRequest,
          res as ExpressResponse,
          next
        );

        expect(mockUpdateUser).not.toHaveBeenCalled();
        expect(mockUpdateOrga).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
