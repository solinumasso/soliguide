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
import * as dotenv from "dotenv";
import { join } from "path";

import {
  fastifyIntegration,
  httpIntegration,
  init,
  nestIntegration,
} from "@sentry/nestjs";

function getEnvPath(): string {
  const isTypescript = __filename.endsWith(".ts"); // ts local / js prod
  const path = isTypescript ? "../../" : "../";
  const envPath = join(__dirname, path, ".env");

  console.log(
    "Environment detected:",
    isTypescript ? "TypeScript" : "JavaScript"
  );
  console.log("Loading .env from:", envPath);

  return envPath;
}

dotenv.config({ path: getEnvPath() });

if (!!process.env.LOCATION_API_SENTRY_DSN) {
  init({
    enabled: !!process.env.LOCATION_API_SENTRY_DSN,
    dsn: process.env.LOCATION_API_SENTRY_DSN,
    environment: process.env.ENV,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [httpIntegration(), fastifyIntegration(), nestIntegration()],
  });
}
