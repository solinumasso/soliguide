import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../_models";

import { validationResult, matchedData } from "express-validator";

export const getFilteredData = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  req.bodyValidated = matchedData(req, {
    includeOptionals: true,
  });

  next();
};
