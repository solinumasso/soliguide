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
import * as Joi from 'joi';

export const CONFIG_VALIDATOR = Joi.object({
  PORT: Joi.number().default(3003),
  NODE_ENV: Joi.string().valid('prod', 'test', 'local').default('local'),
  SOLIGARE_SENTRY_DSN: Joi.string().uri(),
  POSTGRES_EXTERNAL_USERNAME: Joi.string().default('postgres'),
  POSTGRES_EXTERNAL_PASSWORD: Joi.string().default('postgres'),
  POSTGRES_EXTERNAL_HOST: Joi.string().default('localhost'),
  POSTGRES_EXTERNAL_PORT: Joi.number().default(5432),
  POSTGRES_EXTERNAL_DATABASE: Joi.string().default('postgres'),
});
