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
export enum TestAccounts {
  USER_ADMIN_SOLIGUIDE = "USER_ADMIN_SOLIGUIDE",
  USER_ADMIN_TERRITORY = "USER_ADMIN_TERRITORY",
  USER_API_ALIMENTATION = "USER_API_ALIMENTATION",
  USER_API_BLOCKED = "USER_API_BLOCKED",
  USER_API_DEFAULT = "USER_API_DEFAULT",
  USER_API_PARIS = "USER_API_PARIS",
  USER_PRO_EDITOR = "USER_PRO_EDITOR",
  USER_PRO_OWNER = "USER_PRO_OWNER",
  USER_PRO_OWNER_ORGA1_EDITOR_ORGA2 = "USER_PRO_OWNER_ORGA1_EDITOR_ORGA2",
  USER_PRO_READER = "USER_PRO_READER",
  USER_TRANSLATOR_EN_AR = "USER_TRANSLATOR_EN_AR",
}

export enum ExpectedStatus {
  FAIL = "fail",
  SUCCESS = "success",
  PROCESSING = "processing",
  NOT_FOUND = "not-found",
  ERROR = "error",
}

export type AuthTokens = { [_key in TestAccounts]: string | null };
