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
import { CountryCodes, type Themes } from "@soliguide/common";

import type { ModelWithId, User, UserPopulateType } from "../../_models";
import { CONFIG } from "../../_models/config";
import { AmqpEvent } from "../interfaces";
import { AmqpSynchroAirtableUserEvent } from "./AmqpSynchroAirtableUserEvent.class";

export class AmqpSynchroBrevoUserEvent
  extends AmqpSynchroAirtableUserEvent
  implements AmqpEvent
{
  public createdAt: Date | null;

  public lastLogin: Date | null;

  public listIds: number[];

  constructor(
    user: UserPopulateType | ModelWithId<User>,
    frontendUrl: string,
    theme: Themes | null,
    deleted = false
  ) {
    super(user, frontendUrl, theme, deleted);

    this.createdAt = user.verifiedAt ?? user.createdAt ?? null;

    this.lastLogin = user.lastLogin ?? null;

    this.listIds = this.computeListIds(user);
  }

  private computeListIds(user: UserPopulateType | ModelWithId<User>): number[] {
    const listIds: number[] = [];

    if (!user.areas) {
      return listIds;
    }

    if (user.areas[CountryCodes.FR] && CONFIG.BREVO_LIST_ID_FR) {
      listIds.push(CONFIG.BREVO_LIST_ID_FR);
    }

    if (user.areas[CountryCodes.ES] && CONFIG.BREVO_LIST_ID_ES) {
      listIds.push(CONFIG.BREVO_LIST_ID_ES);
    }

    if (user.areas[CountryCodes.AD] && CONFIG.BREVO_LIST_ID_AD) {
      listIds.push(CONFIG.BREVO_LIST_ID_AD);
    }

    return listIds;
  }
}
