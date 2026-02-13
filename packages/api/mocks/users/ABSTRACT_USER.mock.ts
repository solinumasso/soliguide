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
import { DEFAULT_USER_PROPS } from "../../src/user/constants";

export const ABSTRACT_USER = {
  ...DEFAULT_USER_PROPS,
  password: "$3b$13$a5/ctOpbfabYZwHeAupJVKn.LVkhCHzk1qqX51ksy7SZ8GbQupkhU",
  territories: ["93"],
  verified: true,
  translator: false,
  lastLogin: new Date("2020-11-19T08:33:39.326Z"),
  createdAt: new Date("2020-11-19T08:33:39.326Z"),
  updatedAt: new Date("2021-03-31T16:08:46.215Z"),
};
