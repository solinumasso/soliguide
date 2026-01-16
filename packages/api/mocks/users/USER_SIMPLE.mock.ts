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
import type { User } from "../../src/_models";
import { UserStatus } from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";

export const USER_SIMPLE: User = {
  ...ABSTRACT_USER,
  ...{
    updatedAt: new Date("2021-11-17T11:45:41.165"),
    createdAt: new Date("2021-11-17T11:45:41.165"),
    lastname: "Nom simple utilisateur",
    mail: "simple-utilisateur@soliguide.dev",
    name: "Prénom simple utilisateur",
    status: UserStatus.SIMPLE_USER,
    territories: ["93"],
    user_id: 123456789,
    lastLogin: new Date("2025-11-17T11:45:41.165"),
  },
};
