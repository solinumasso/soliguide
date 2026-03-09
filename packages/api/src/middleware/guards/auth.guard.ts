import { NextFunction } from "express";
import { UserStatus } from "@soliguide/common";
import { ExpressResponse, ExpressRequest } from "../../_models";

export const checkRights =
  (allowedStatus: UserStatus[]) =>
  (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const hasAccess = allowedStatus.includes(req.user?.status);
    if (!hasAccess) {
      return res.status(403).send({ message: "FORBIDDEN" });
    }
    return next();
  };
