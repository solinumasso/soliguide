import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models/express";

import { UserStatus } from "@soliguide/common";

export const isUserToSync = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  if (
    req.userToSync &&
    (req.userToSync.mail.includes("mercipourlinvit.fr") ||
      req.userToSync.status in
        [
          UserStatus.VOLUNTEER,
          UserStatus.API_USER,
          UserStatus.ADMIN_SOLIGUIDE,
          UserStatus.ADMIN_TERRITORY,
        ])
  ) {
    return;
  }
  next();
};
