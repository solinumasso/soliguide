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
// Import first to make it tracks as much as possible
// see https://docs.sentry.io/platforms/javascript/guides/express/install/esm-without-import/
import "./instrument";

import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";

import { anonymizeDb } from "./config/database/anonymizeDb";
import { restoreSynchro } from "./config/synchro/restoreSynchro";
import { bulkIndexPlaces } from "./search-engine/typesense";
import { TypesenseClient } from "./search-engine/services/TypesenseClient.service";

import { httpLogger, logger } from "./general/logger";

import { CONFIG, ExpressRequest, ExpressResponse } from "./_models";

logger.info(CONFIG);

import "./config/database/connection";
import "./config/i18n.config";

import { s3Middleware } from "./general/services/s3";

// global middleware
import {
  getCurrentUser,
  handleRequest,
  setUserForLogs,
  handleAdminRight,
  originGuard,
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

// Search engine
import searchEngine from "./search-engine/routes/search.routes";

// Export
import autoExportRoute from "./autoexport/routes/autoexport.routes";

// Campaign
import campaign from "./campaign/routes/campaign.routes";

// Emailing
import emailing from "./emailing/routes/emailing.routes";
import emailTemplates from "./emailing/routes/email-templates.routes";

// Stats
import stats from "./stats/routes/stats.routes";

// Index
import index from "./general/routes/general.routes";

// Categories V2
import categories from "./categories/routes/categories.routes";

// Soligare
import soligare from "./soligare/routes/soligare.routes";

// Jobs
import { importCategories } from "./place/utils";
import { serve, setup } from "swagger-ui-express";

const _app = express();

_app.use(httpLogger);
_app.use(
  cors({
    credentials: true,
    allowedHeaders: [
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
    ],
  })
);

const isPublicRoute = (path: string): boolean => {
  return (
    path.startsWith("/medias/") ||
    path.startsWith("/sitemap") ||
    path === "/robots.txt"
  );
};
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
  if (isPublicRoute(req.path)) {
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
  handleRequest, // retrieve request informations like origin, referer, ...
  setUserForLogs, // create a user for Log
]);

_app.use((req: ExpressRequest, res, next) => {
  if (isPublicRoute(req.path)) {
    next();
  } else {
    originGuard(req, res, next);
  }
});

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

_app.use("/emailing", emailing);
_app.use("/email-templates", emailTemplates);

_app.use("/v2/categories", categories);

_app.use("/v2/soligare", soligare);

if (TypesenseClient.isTypesenseEnabled) {
  _app.use("/v2/search", searchEngine);
}

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

(async () => {
  if (CONFIG.ENV !== "test" && CONFIG.CRON_ENABLED) {
    await import("./cron/cron-manager");
  }

  if (CONFIG.ENV !== "prod" && CONFIG.ENV !== "test" && CONFIG.DEV_ANON) {
    await anonymizeDb();
  }

  if (CONFIG.ENV !== "prod" && CONFIG.RESTORE_SYNC) {
    await restoreSynchro();
  }

  if (CONFIG.ENV === "prod" || CONFIG.ENV === "preprod") {
    await importCategories();
  }
})();

if (CONFIG.ENV !== "test") {
  _app.listen(CONFIG.PORT, async () => {
    logger.info(`Soliguide API running on port ${CONFIG.PORT}`);

    if (TypesenseClient.isTypesenseEnabled) {
      await TypesenseClient.instance.createCollections();
      await bulkIndexPlaces();
    }
  });
}

export const app = _app;
