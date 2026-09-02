import { verify } from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";
import {
  SupportedLanguagesCode,
  UserStatus,
  UserStatusNotLogged,
  UserTypeLogged,
} from "@soliguide/common";
import {
  CONFIG,
  CurrentUserType,
  ExpressRequest,
  ExpressResponse,
  NotLoggedUserType,
  UserFactory,
} from "../../_models";
import { getUserByIdWithUserRights } from "../../user/services";
import {
  clearAuthCookie,
  getAuthCookieToken,
  getAuthTokenFromRequest,
} from "../../user/utils";

/** Returns the user id carried by a verified token, or null if the token is unusable. */
const getUserIdFromToken = (
  err: unknown,
  decoded: JwtPayload | string | undefined
): string | null => {
  if (err || !decoded || typeof decoded === "string") {
    return null;
  }

  return typeof decoded._id === "string" ? decoded._id : null;
};

export const getCurrentUser = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const token = getAuthTokenFromRequest(req);
  // The cookie takes precedence in `getAuthTokenFromRequest`, so a session cookie
  // being present means the token below came from it and not from a header.
  const isSessionCookie = Boolean(getAuthCookieToken(req));

  const language = SupportedLanguagesCode.FR;

  // init status boolean
  req.isSuperAdmin = false;
  req.isAdmin = false;
  req.isAdminOrPro = false;

  req.user = UserFactory.createUser({
    type: UserTypeLogged.NOT_LOGGED,
    status: UserStatusNotLogged.NOT_LOGGED,
    language,
  } as NotLoggedUserType);

  if (!token) {
    return next();
  }

  return verify(
    token,
    CONFIG.JWT_SECRET,
    // A session cookie must expire: it is a real security boundary, and the browser
    // drops the cookie at the same time anyway. Integration tokens passed in the
    // Authorization header are handed out once to partners and never renewed
    // (see `createDevToken`), so their expiry is ignored, as it was before the
    // session moved to a cookie.
    { ignoreExpiration: !isSessionCookie },
    async (err, decoded) => {
      const userId = getUserIdFromToken(err, decoded);
      const user = userId ? await getUserByIdWithUserRights(userId) : null;

      if (user?.verified) {
        // Logged user
        user.type = UserTypeLogged.LOGGED;

        req.user = UserFactory.createUser(user);

        return next();
      }

      // A session cookie is ambient state: the browser resends it on every request and
      // the front-end cannot delete it, since it is httpOnly. Rejecting it would lock
      // the visitor out of the public routes too, with no way to recover. Dropping the
      // cookie and continuing anonymously self-heals the session instead.
      if (isSessionCookie) {
        clearAuthCookie(req, res);

        return next();
      }

      // A token in the Authorization header is a credential the caller chose to
      // present, so it is told why it was refused.
      const message = userId ? "USER_NOT_VERIFIED" : "INVALID_TOKEN";

      return res.status(401).json({ message });
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

/**
 * Express middleware that authenticates a request using a JWT passed as a
 * `token` query-string parameter.
 *
 * The token is verified with `ignoreExpiration` so that magic-link style flows
 * can still identify the user regardless of token age. If the token is missing,
 * invalid, or belongs to an unverified account, the middleware responds with
 * `401` and short-circuits the request. On success it populates `req.user` and
 * calls `next()`.
 */
export const getCurrentUserFromQueryToken = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(401).json({ message: "MISSING_TOKEN" });
  }

  return verify(
    token,
    CONFIG.JWT_SECRET,
    { ignoreExpiration: true },
    async (err, decoded) => {
      const userId = getUserIdFromToken(err, decoded);

      if (!userId) {
        return res.status(401).json({ message: "INVALID_TOKEN" });
      }

      const user = await getUserByIdWithUserRights(userId);

      if (!user?.verified) {
        return res.status(401).json({ message: "USER_NOT_VERIFIED" });
      }

      user.type = UserTypeLogged.LOGGED;
      req.user = UserFactory.createUser(user);

      return next();
    }
  );
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
