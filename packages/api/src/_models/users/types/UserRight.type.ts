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
import mongoose from "mongoose";

import { ApiOrganization, UserRightStatus, UserRole } from "@soliguide/common";
import { ModelWithId } from "../../mongo";
import { PopulatedUser } from "./PopulatedUser.type";

export interface UserRight {
  _id?: mongoose.Types.ObjectId;
  displayContactPro: boolean;
  organization: mongoose.Types.ObjectId;
  organization_id: number;
  place: mongoose.Types.ObjectId | null;
  place_id: number | null;
  role: UserRole;
  status: UserRightStatus;
  user: mongoose.Types.ObjectId;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRightUserPopulate = ModelWithId<Omit<UserRight, "user">> &
  Required<{
    user: PopulatedUser;
  }>;

export type UserRightOrganizationPopulate = ModelWithId<
  Omit<UserRight, "organization">
> &
  Required<{
    organization: ModelWithId<ApiOrganization>;
  }>;
