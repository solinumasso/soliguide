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
import "../instrument";

import Bree from "bree";
import { join } from "path";
import { logger } from "../general/logger";

const defaultExtension =
  __filename.split(".").pop() === "ts" ? ".ts" : "" + ".js";

const bree = new Bree({
  /**
   * Always set the root option when doing any type of
   * compiling with bree. This just makes it clearer where
   * bree should resolve the jobs folder from. By default it
   * resolves to the jobs folder relative to where the program
   * is executed.
   */
  root: join(__dirname, "jobs"),

  logger: {
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
  },

  jobs: [
    // ----
    // GENERAL
    {
      interval: "at 1:15 am",
      name: "[GENERAL] Imports categories",
      path: join(
        __dirname,
        "jobs",
        "general",
        `import-categories.job${defaultExtension}`
      ),
    },
    // ----
    // TRANSLATIONS
    {
      interval: "every 2 minutes",
      name: "[TRANSLATION] Translates text elements thanks to GTranslate API",
      path: join(
        __dirname,
        "jobs",
        "translations",
        `translate-fields.job${defaultExtension}`
      ),
    },
    // ----
    // AIRTABLE
    {
      interval: "every 30 seconds",
      name: "[AIRTABLE] Synchronizes created and updated data",
      path: join(
        __dirname,
        "jobs",
        "airtable",
        `sync-at-soliguide.job${defaultExtension}`
      ),
    },
    {
      interval: "every 1 hours",
      name: "[AIRTABLE] Synchronizes places opening status",
      path: join(
        __dirname,
        "jobs",
        "airtable",
        `sync-place-opening-closing.job${defaultExtension}`
      ),
    },
    {
      interval: "at 4:00 am",
      name: "[AIRTABLE] Synchronizes places closing status",
      path: join(
        __dirname,
        "jobs",
        "airtable",
        `sync-place-closed-today.job${defaultExtension}`
      ),
    },
    // ----
    // PLACES
    // {
    //   interval: "at 3:00 am",
    //   name: "[PLACES] Set un-updated places offline",
    //   path: join(
    //     __dirname,
    //     "jobs",
    //     "fiches",
    //     `set-offline.job${defaultExtension}`
    //   ),
    // },
    {
      interval: "at 3:50 am",
      name: "[PLACES] Unset obsolete temporary information on places",
      path: join(
        __dirname,
        "jobs",
        "fiches",
        `unset-obsolete-temp-info.job${defaultExtension}`
      ),
    },
    {
      interval: "at 3:15 am",
      name: "[PLACES] Set current temporary information on places",
      path: join(
        __dirname,
        "jobs",
        "fiches",
        `set-current-temp-info.job${defaultExtension}`
      ),
    },
    {
      interval: "at 1:00 am",
      name: "[PLACES] Set isOpenToday on places",
      path: join(
        __dirname,
        "jobs",
        "fiches",
        `set-isOpenToday.job${defaultExtension}`
      ),
    },
    // ----
    // CAMPAIGN
    {
      interval: "at 9:00 am",
      name: "[MAILGUN] Send remind me emails",
      path: join(
        __dirname,
        "jobs",
        "emailing",
        `send-remind-me-emails.job${defaultExtension}`
      ),
    },
    {
      interval: "every 1 minute",
      name: "[MAILGUN] Send Emails",
      path: join(
        __dirname,
        "jobs",
        "emailing",
        `send-campaign-emails.job${defaultExtension}`
      ),
    },
    {
      interval: "every 1 minute",
      name: "[MAILGUN] Update email status",
      path: join(
        __dirname,
        "jobs",
        "emailing",
        `mailgun-update-emails-status.job${defaultExtension}`
      ),
    },
  ],
});

// start all jobs (this is the equivalent of reloading a crontab):
(async () => {
  await bree.start();
})();
