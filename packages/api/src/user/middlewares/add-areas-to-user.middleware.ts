import { NextFunction } from "express";
import {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";
import { buildUserAreas } from "../utils";

export const addAreasToUser = (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  _res: ExpressResponse,
  next: NextFunction
) => {
  const userData = req.bodyValidated;
  const { selectedUser } = req;

  const areasAndTerritories = buildUserAreas(selectedUser, {
    country: userData.country,
    territories: req.bodyValidated.territories,
  });

  req.bodyValidated = { ...userData, ...areasAndTerritories };

  next();
};
