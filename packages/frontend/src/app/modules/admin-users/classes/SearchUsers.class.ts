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
import { UserSearchContext, UserStatus } from "@soliguide/common";

import { ManageSearch } from "../../../models/manage-search";
import { User } from "../../users/classes";

export class SearchUsersObject extends ManageSearch {
  public mail: string | null;
  public name: string | null;
  public status?: UserStatus;
  public verified?: boolean;
  public context: UserSearchContext;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.mail = data?.mail ?? null;
    this.name = data?.name ?? null;
    this.status = data?.status ?? null;
    this.verified = data?.verified ?? null;
    this.context = data?.context ?? UserSearchContext.MANAGE_USERS;
  }
}
