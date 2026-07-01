import type { CookieOptions } from "express";

import {
  CONFIG,
  type ExpressRequest,
  type ExpressResponse,
} from "../../_models";

const AUTH_COOKIE_DOMAIN_SUFFIXES = [
  "soliguide.fr",
  "soliguide.dev",
  "soliguia.ad",
  "soliguia.cat",
  "soliguia.es",
  "soliguia.eu",
] as const;

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const getRequestHostname = (req: ExpressRequest): string | null => {
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0].trim();
  const host = forwardedHost ?? req.get("host");

  if (!host) {
    return null;
  }

  return host.split(":")[0].toLowerCase();
};

const getAuthCookieDomain = (req: ExpressRequest): string | undefined => {
  if (CONFIG.ENV === "dev" || CONFIG.ENV === "test") {
    return undefined;
  }

  const hostname = getRequestHostname(req);

  if (!hostname) {
    return undefined;
  }

  const domain = AUTH_COOKIE_DOMAIN_SUFFIXES.find(
    (domainSuffix) =>
      hostname === domainSuffix || hostname.endsWith(`.${domainSuffix}`)
  );

  return domain ? `.${domain}` : undefined;
};

export const getAuthCookieOptions = (req: ExpressRequest): CookieOptions => {
  const domain = getAuthCookieDomain(req);

  return {
    domain,
    httpOnly: true,
    sameSite: "lax",
    secure: CONFIG.ENV !== "dev" && CONFIG.ENV !== "test",
  };
};

export const setAuthCookie = (
  req: ExpressRequest,
  res: ExpressResponse,
  token: string
): void => {
  res.cookie(CONFIG.AUTH_COOKIE_NAME, token, {
    ...getAuthCookieOptions(req),
    maxAge: CONFIG.AUTH_COOKIE_MAX_AGE_DAYS * MILLISECONDS_IN_DAY,
  });
};

export const clearAuthCookie = (
  req: ExpressRequest,
  res: ExpressResponse
): void => {
  res.clearCookie(CONFIG.AUTH_COOKIE_NAME, getAuthCookieOptions(req));
};

export const getAuthTokenFromRequest = (
  req: ExpressRequest
): string | undefined => {
  const cookieToken = req.cookies?.[CONFIG.AUTH_COOKIE_NAME];

  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("JWT ")) {
    return undefined;
  }

  return authorizationHeader.slice(4);
};
