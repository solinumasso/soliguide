// Import first to make it tracks as much as possible
// see https://docs.sentry.io/platforms/javascript/guides/express/install/esm-without-import/
import "./instrument";
import { connectToDatabase } from "./config/database/connection";

import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import { anonymizeDb } from "./config/database/anonymizeDb";

import { httpLogger, logger } from "./general/logger";
import {
  CONFIG,
  ExpressRequest,
  ExpressResponse,
  SOLIGUIDE_HOSTNAME_REGEXP,
  SOLIGUIDE_URLS,
} from "./_models";

logger.info(CONFIG);

import "./config/i18n.config";

import { s3Middleware } from "./general/services/s3";
import { isPublicRoute } from "./_utils/isPublicRoute";

// global middleware
import {
  getCurrentUser,
  handleRequest,
  setUserForLogs,
  handleAdminRight,
  handleApiRight,
} from "./middleware";

// Users
import invitationRoutes from "./user/routes/invite-user.routes";
import userRightsRoutes from "./user/routes/user-rights.routes";
import users from "./user/routes/user.routes";
import adminUsers from "./user/routes/user-admin.routes";

// Organizations
import organization from "./organization/routes/organization.routes";

// Places
import adminPlace from "./place/routes/admin-place.routes";
import integration from "./place/routes/integration.routes";
import documents from "./place/routes/document.routes";
import photos from "./place/routes/photo.routes";
import place from "./place/routes/place.routes";
import placeContacts from "./place/routes/place-contacts.routes";

// History
import placeChanges from "./place-changes/routes/place-changes.routes";

// Temporary information
import tempInfo from "./temp-info/routes/temp-info.routes";

// Translations
import translations from "./translations/routes/translations.routes";

// Search
import search from "./search/routes/search.routes";

// Export
import autoExportRoute from "./autoexport/routes/autoexport.routes";

// Campaign
import campaign from "./campaign/routes/campaign.routes";
import campaignAdmin from "./campaign/routes/campaign-admin.routes";
import campaignTempForms from "./campaign/routes/campaign-temp-forms.routes";

// Stats
import stats from "./stats/routes/stats.routes";

// Index
import index from "./general/routes/general.routes";

// Categories V2
import categories from "./categories/routes/categories.routes";

// Ops
import ops from "./ops/routes/ops.routes";

// Jobs
import { serve, setup } from "swagger-ui-express";
import { searchSuggestionsService } from "./search-suggestions";
import { initializeCronJobs } from "./cron/cron-manager";

const _app = express();

/**
 * CORS policy
 *
 * The session token now lives in an httpOnly cookie (see `user/utils/authCookie.ts`),
 * so calls from our own front-ends are credentialed requests. The CORS spec forbids
 * `Access-Control-Allow-Origin: *` on those, and the `credentials` flag itself has to
 * differ per caller, which is why a static `cors()` config is not enough and the
 * options delegate below recomputes everything per request.
 *
 * Caller                              | Allow-Origin                | Allow-Credentials
 * ------------------------------------|-----------------------------|------------------
 * No Origin header (server to server) | not sent                    | true
 * Known Soliguide origin              | the origin + `Vary: Origin` | true
 * Unknown origin, token auth          | the origin + `Vary: Origin` | not sent
 * Unknown origin, no auth             | `*`                         | not sent
 */

// Trailing slashes are stripped on both sides of the comparison: env vars are often
// written `https://soliguide.fr/` while a browser Origin header never has one.
const allowedCorsOrigins = new Set(
  [...SOLIGUIDE_URLS, CONFIG.FRONTEND_URL, CONFIG.WIDGET_URL].map((url) =>
    url.replace(/\/$/, "")
  )
);

const allowedCorsHeaders = [
  "Authorization",
  "Accept",
  "Origin",
  "DNT",
  "X-Document-Referrer",
  "Keep-Alive",
  "User-Agent",
  "X-Requested-With",
  "If-Modified-Since",
  "Cache-Control",
  "Content-Type",
  "Content-Range",
  "Range",
  "X-Ph-User-Distinct-Id",
  "X-Ph-User-Session-Id",
];

/**
 * Exact match first, then a hostname pattern fallback for the Soliguide domains that
 * cannot be listed in env vars, typically the per-PR demo environments such as
 * `fr.demo.soliguide.dev`. `new URL` is guarded because the Origin header is client
 * controlled: it can be malformed, or the literal string "null" for a sandboxed
 * iframe or a `file://` page, which would throw and turn a rejection into a 500.
 */
const isAllowedCorsOrigin = (origin: string): boolean => {
  const cleanOrigin = origin.replace(/\/$/, "");

  if (allowedCorsOrigins.has(cleanOrigin)) {
    return true;
  }

  try {
    const { hostname } = new URL(cleanOrigin);
    return SOLIGUIDE_HOSTNAME_REGEXP.test(hostname);
  } catch (_error) {
    return false;
  }
};

/**
 * A preflight OPTIONS request never carries the actual Authorization header, it only
 * announces it in `Access-Control-Request-Headers`. Both are checked, otherwise the
 * preflight of a token based caller would fall through to the public branch and the
 * real request would never be sent.
 */
const hasAuthorizationHeader = (req: Request): boolean => {
  const requestedHeaders = req
    .get("access-control-request-headers")
    ?.split(",")
    .map((header) => header.trim().toLowerCase());

  return (
    Boolean(req.get("authorization")) ||
    Boolean(requestedHeaders?.includes("authorization"))
  );
};

_app.use(httpLogger);
_app.use(
  cors((req: Request, callback) => {
    const origin = req.get("origin");

    // No Origin header: no browser is enforcing CORS. curl, server to server calls,
    // healthchecks, native mobile webviews. `origin: true` echoes the request Origin,
    // absent here, so no Allow-Origin header is emitted at all.
    if (!origin) {
      return callback(null, {
        allowedHeaders: allowedCorsHeaders,
        credentials: true,
        origin: true,
      });
    }

    // Our own apps: echo the exact origin, never `*`, and allow credentials. Those are
    // the two conditions the browser requires before it stores the session cookie and
    // sends it back. The lib adds `Vary: Origin` so caches and CDNs never serve one
    // domain the response computed for another.
    if (isAllowedCorsOrigin(origin)) {
      return callback(null, {
        allowedHeaders: allowedCorsHeaders,
        credentials: true,
        origin,
      });
    }

    // API users (`UserStatus.API_USER`) and partner integrations authenticating with
    // `Authorization: JWT ...`. A header is not a CORS credential, so the token keeps
    // working, while `credentials: false` stops the browser from attaching our session
    // cookie to these unknown origins.
    if (hasAuthorizationHeader(req)) {
      return callback(null, {
        allowedHeaders: allowedCorsHeaders,
        credentials: false,
        origin,
      });
    }

    // Public unauthenticated traffic, typically the widget embedded on partner sites.
    // Careful: `origin: false` does NOT reject the request, the cors lib answers
    // `Access-Control-Allow-Origin: *`. Reads stay as open as they were before the
    // cookie migration, only the session cookie is withheld.
    return callback(null, {
      allowedHeaders: allowedCorsHeaders,
      credentials: false,
      origin: false,
    });
  })
);

_app.use(compression());

_app.use(
  express.json({
    limit: "20mb",
  })
);

_app.use(express.raw());

_app.use(
  express.urlencoded({
    extended: false,
  })
);

_app.use(cookieParser());

_app.use((req: Request, res: Response, next: NextFunction) => {
  if (isPublicRoute(req?.path)) {
    res.removeHeader("X-Robots-Tag");
    return next();
  }

  res.header("X-Robots-Tag", "noindex, nofollow");
  next();
});

_app.use("/", index);

_app.use("/robots.txt", (_req: ExpressRequest, res: ExpressResponse) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /medias/
Allow: /sitemap
Disallow: /`);
});

// First middlewares
_app.use([
  getCurrentUser, // retrieve current user
  handleRequest, // retrieve request informations like origin, referer, and validates origin for non-public routes
  setUserForLogs, // create a user for Log
]);

// Auth middlewares
_app.use([
  handleAdminRight, // check admin right
  handleApiRight, // check api right
]);

_app.use("/invite-user", invitationRoutes);
_app.use("/users", users);

_app.use("/admin/user-rights", userRightsRoutes);
_app.use("/admin/users", adminUsers);

_app.use("/organizations", organization);

_app.use("/documents", documents);
_app.use("/photos", photos);
_app.use("/place", place);
_app.use("/place-contacts", placeContacts);
_app.use("/place-changes", placeChanges);

_app.use("/admin/places", adminPlace);
_app.use("/integration", integration);

_app.use("/medias/documents", s3Middleware(CONFIG.S3_DOCUMENTS_BUCKET_NAME));
_app.use("/medias/pictures", s3Middleware(CONFIG.S3_PICTURES_BUCKET_NAME));

_app.use("/temp-infos", tempInfo);

_app.use("/new-search", search);

_app.use("/autoexport", autoExportRoute);

_app.use("/stats", stats);

_app.use("/campaign", campaign);
_app.use("/admin/campaigns", campaignAdmin);
_app.use("/campaign-temp-forms", campaignTempForms);

_app.use("/v2/categories", categories);

_app.use("/ops", ops);

const options = {
  apis: [
    "./src/place/routes/admin-place.routes.js",
    "./src/place/routes/place.routes",
  ],
  swaggerDefinition: {
    info: {
      title: "Soliguide API DOC",
      version: "2.0.0",
    },
  },
};

const swaggerSpec = swaggerJSDoc(options);

_app.use("/api-docs", serve, setup(swaggerSpec));

_app.use("/translations", translations);

_app.use((req: Request, res: Response) => {
  if (!res.headersSent) {
    res.status(404).send({ message: `Route ${req.url} not found.` });
  }
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    // Connect to MongoDB with retry logic before starting the application
    await connectToDatabase();

    // Load search suggestions from JSON files into Fuse.js indexes
    if (CONFIG.ENV !== "test") {
      searchSuggestionsService.initialize();
    }

    if (CONFIG.ENV !== "test" && CONFIG.CRON_ENABLED) {
      console.log("Initializing cron jobs...");
      initializeCronJobs();
    }

    if (CONFIG.ENV !== "prod" && CONFIG.ENV !== "test" && CONFIG.DEV_ANON) {
      await anonymizeDb();
    }

    if (CONFIG.ENV !== "test") {
      _app.listen(CONFIG.PORT, async () => {
        logger.info(`Soliguide API running on port ${CONFIG.PORT}`);
      });
    }
  } catch (err) {
    logger.fatal({ err }, "Erreur fatale lors du démarrage de l'application");
    process.exit(1);
  }
})();

export const app = _app;
