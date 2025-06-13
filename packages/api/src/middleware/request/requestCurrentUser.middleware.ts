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

import { verify } from "jsonwebtoken";
import { NextFunction } from "express";
import {
  SupportedLanguagesCode,
  UserStatus,
  UserStatusNotLogged,
  UserTypeLogged,
} from "@soliguide/common";
import { CONFIG, ExpressRequest, ExpressResponse } from "../../_models";
import { getUserByIdWithUserRights } from "../../user/services";
import { UserPopulate, CurrentUserType } from "../../user/interfaces";

export const getCurrentUser = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.slice(4) as string;

  const language = SupportedLanguagesCode.FR;

  // init status boolean
  req.isSuperAdmin = false;
  req.isAdmin = false;
  req.isAdminOrPro = false;

  req.user = {
    type: UserTypeLogged.NOT_LOGGED,
    status: UserStatusNotLogged.NOT_LOGGED,
    language,
    isLogged: () => false,
  } as unknown as UserPopulate;

  if (!token) {
    return next();
  }

  return verify(
    token,
    CONFIG.JWT_SECRET,
    { ignoreExpiration: true },
    async (err, decoded) => {
      if (
        err ||
        !decoded ||
        !Object.prototype.hasOwnProperty.call(decoded, "_id") ||
        !(decoded as { _id: unknown })._id ||
        typeof (decoded as { _id: unknown })._id !== "string"
      ) {
        return res.status(401).json({ message: "INVALID_TOKEN" });
      }

      const user = await getUserByIdWithUserRights(
        (decoded as { _id: string })._id
      );

      if (!user?.verified) {
        return res.status(401).json({ message: "USER_NOT_VERIFIED" });
      }

      // Logged user
      user.type = UserTypeLogged.LOGGED;

      req.user = new UserPopulate(user);

      next();
    }
  );
};

export const handleAdminRight = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  const user: CurrentUserType = req.user;

  if (user.isLogged()) {
    req.isSuperAdmin = user.status === UserStatus.ADMIN_SOLIGUIDE;

    req.isAdmin =
      req.isSuperAdmin || user.status === UserStatus.ADMIN_TERRITORY;

    req.isAdminOrPro = req.isAdmin || user.status === UserStatus.PRO;
  }
  return next();
};

const canUserHaveAccessRights = (req: ExpressRequest): boolean => {
  if (req.user.status !== UserStatus.API_USER) {
    return true;
  }

  if (req.user.blocked) {
    return false;
  }

  // API USERS: access restricted to 3 routes only
  const urlsAuthorized = ["/new-search", "/place", "/v2/categories"];

  const url = req.url;

  // ex. : if url === '/new-search'
  if (urlsAuthorized.indexOf(url) !== -1) {
    return true;
  }

  let authorized = false;
  urlsAuthorized.forEach((urlAuthorized) => {
    if (url.startsWith(`${urlAuthorized}`)) {
      authorized = true;
      return;
    }
  });

  return authorized;
};
export const handleApiRight = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.user.isLogged()) {
    return next();
  }

  if (!canUserHaveAccessRights(req)) {
    return res.status(403).send({ message: "FORBIDDEN_ACCESS" });
  }
  return next();
};

// Some /search URL must not be available to API users
export const isNotApiUser = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (req.user?.status !== UserStatus.API_USER) {
    next();
  } else {
    return res.status(403).send({ message: "FORBIDDEN_FOR_API_USER" });
  }
};
