import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models";

import { findByPasswordToken } from "../../user/services/passwords.service";

export const tokenPasswordGuard = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (
    req.params.passwordToken == null || // null or undefined
    req.params.passwordToken === "null"
  ) {
    return res.status(400).send({ message: "PASSWORD_TOKEN_FAIL" });
  }

  try {
    const user = await findByPasswordToken(req.params.passwordToken);

    if (user) {
      next();
    } else {
      return res.status(400).send({ message: "PWD_UPDATE_FAIL" });
    }
  } catch (e) {
    req.log.error(e);
    return res.status(400).send({ message: "PWD_UPDATE_FAIL" });
  }
};
