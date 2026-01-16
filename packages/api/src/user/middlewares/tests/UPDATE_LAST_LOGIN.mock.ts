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
import mongoose from "mongoose";
import { subDays, subMonths, subYears } from "date-fns";

import { UserTypeLogged } from "@soliguide/common";
import type { ExpressRequest, ExpressResponse } from "../../../_models";

export const MOCK_USER_ID = new mongoose.Types.ObjectId(
  "507f1f77bcf86cd799439011"
);
export const MOCK_ORG_ID = new mongoose.Types.ObjectId(
  "507f1f77bcf86cd799439012"
);

export const MOCK_USER_NOT_LOGGED = {
  isLogged: () => false,
} as unknown as ExpressRequest["user"];

export const MOCK_USER_LOGGED = {
  _id: MOCK_USER_ID,
  isLogged: () => true,
  lastLogin: null,
  organizations: [{ _id: MOCK_ORG_ID, lastLogin: null }],
  selectedOrgaIndex: 0,
  type: UserTypeLogged.LOGGED,
} as unknown as ExpressRequest["user"];

export const createMockRequest = (
  user?: ExpressRequest["user"]
): Partial<ExpressRequest> => ({
  user,
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  } as unknown as ExpressRequest["log"],
});

export const createMockResponse = (): Partial<ExpressResponse> => ({});

export const getYesterdayDate = (): Date => subDays(new Date(), 1);

export const getLastYearDate = (): Date => subYears(new Date(), 1);

export const getLastMonthDate = (): Date => subMonths(new Date(), 1);
