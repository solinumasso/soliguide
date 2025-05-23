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
import "./sentry/instrument";
import { bootstrapApplication } from "./app-bootstrap";
import { ConfigService } from "@nestjs/config";
import { captureMessage } from "@sentry/nestjs";

(async () => {
  const app = await bootstrapApplication();
  // Get port
  const configService = app.get(ConfigService);

  const port = configService.get("PORT");

  if (configService.get("ENV") !== "test") {
    // enableShutdownHooks consumes memory by starting listeners.
    // In cases where you are running multiple Nest apps in a single Node process
    // (e.g., when running parallel tests with Jest),
    // Node may complain about excessive listener processes.
    // For this reason, enableShutdownHooks is not enabled by default.
    // Be aware of this condition when you are running multiple instances in a single Node process.
    // see more https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();
  }

  if (configService.get("ENV") === "prod") {
    captureMessage(`[INFO] [LOCATION-API] Restart - ${new Date()}`);
  }

  await app.listen(port, "0.0.0.0");
})();
