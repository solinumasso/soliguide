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
