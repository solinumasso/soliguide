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

import * as Joi from "joi";
import { THREE_MONTHS_IN_MS } from "./TTL.const";

export const CONFIG_VALIDATOR = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid("prod", "test", "local").default("local"),
  LOCATION_API_SENTRY_DSN: Joi.string().uri().optional(),
  FRENCH_ADDRESS_API_URL: Joi.string()
    .uri()
    .default("https://data.geopf.fr/geocodage"),
  HERE_API_KEY: Joi.string().required(),
  SOLIGUIDE_DOMAINS: Joi.string(),
  REDIS_URL: Joi.string().uri().optional(),
  REDIS_TTL: Joi.number().default(THREE_MONTHS_IN_MS),
});
