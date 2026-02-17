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
import { UserStatus } from "@soliguide/common";
import { ModelWithId, User } from "../../_models";

export const DEFAULT_USER_PROPS: Pick<
  ModelWithId<User>,
  | "blocked"
  | "categoriesLimitations"
  | "devToken"
  | "invitations"
  | "languages"
  | "organizations"
  | "passwordToken"
  | "phone"
  | "selectedOrgaIndex"
  | "status"
  | "territories"
  | "title"
  | "translator"
  | "verified"
  | "verifiedAt"
> = {
  blocked: false,

  categoriesLimitations: [],
  devToken: null,
  invitations: [],
  languages: [],
  organizations: [],
  passwordToken: null,
  phone: null,
  selectedOrgaIndex: 0,
  status: UserStatus.SIMPLE_USER,
  territories: [],
  title: null,
  translator: false,
  verified: false,
  verifiedAt: null,
};
