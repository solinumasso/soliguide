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
import envSchema from "env-schema";

import { ENV_SCHEMA } from "./ENV_SCHEMA.const";

import { Config } from "../interfaces";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const dotenvConfig = (() => {
  // If we are in test mode only in local
  if (process.env.NODE_ENV === "test" && !process.env.DOCKER_ENV) {
    const testEnvPath = resolve(process.cwd(), ".env.test");

    if (existsSync(testEnvPath)) {
      return {
        path: testEnvPath,
      };
    }
  }
  return true;
})();

// If values are missing in the '.env' file and no default values are provided for those in the 'ENV_SCHEMA', the app will automatically crash
export const CONFIG = envSchema<Config>({
  schema: ENV_SCHEMA,
  dotenv: dotenvConfig,
});
