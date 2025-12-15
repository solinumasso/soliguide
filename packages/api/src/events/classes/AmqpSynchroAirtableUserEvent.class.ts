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
import { CountryCodes, parsePhoneNumber, type Themes } from "@soliguide/common";
import type { ModelWithId, User, UserPopulateType } from "../../_models";
import { AmqpEvent, SynchroAirtableEvent } from "../interfaces";
import { AmqpUserEvent } from "./AmqpUserEvent.class";

export class AmqpSynchroAirtableUserEvent
  extends AmqpUserEvent
  implements AmqpEvent, SynchroAirtableEvent
{
  public entityType: "USER";

  public deleted: boolean;

  public countries: CountryCodes[];

  public parsedPhone?: string;

  constructor(
    user: UserPopulateType | ModelWithId<User>,
    frontendUrl: string,
    theme: Themes | null,
    deleted = false
  ) {
    super(user, frontendUrl, theme);

    this.entityType = "USER";

    this.deleted = deleted;

    if (this.phone) {
      this.parsedPhone =
        parsePhoneNumber(this.phone, this.phone.countryCode as CountryCodes) ??
        "";
    }
  }
}
