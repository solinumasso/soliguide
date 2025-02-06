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
import type { UserRightStatus, UserRole } from "@soliguide/common";

import type { UserRight } from "../../_models/users";

export class AmqpUserRight {
  public organization_id: number;
  public status: UserRightStatus;
  public place_id?: number;
  public role: UserRole;

  constructor(userRight: UserRight) {
    this.role = userRight.role;
    this.organization_id = userRight.organization_id;
    this.status = userRight.status;
    this.place_id = userRight.place_id ?? undefined;
  }
}
