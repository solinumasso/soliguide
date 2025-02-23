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
import { CONFIG, ExpressRequest } from "../../../src/_models";
import { RequestInformation } from "../../../src/middleware";

const DEFAULT_REQUEST: ExpressRequest = {
  headers: {},
  log: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  get: jest
    .fn()
    .mockImplementation((name) =>
      name === "origin" ? CONFIG.SOLIGUIDE_FR_URL : null
    ),
} as unknown as ExpressRequest;

export const ABSTRACT_ORIGIN_REQUEST = {
  ...DEFAULT_REQUEST,
  requestInformation: new RequestInformation(DEFAULT_REQUEST),
} as unknown as ExpressRequest;
