import { ExpressRequest, ExpressResponse } from "../../_models";
import { NextFunction } from "express";
import { getUserForLogs } from "./services";
import { getCurrentScope } from "@sentry/node";

export const setUserForLogs = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  // User used for places logs, search, sim
  req.userForLogs = getUserForLogs(req);
  getCurrentScope().setUser(req.user);
  next();
};
