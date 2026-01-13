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
import type { AnyDepartmentCode, Themes, UserRole } from "@soliguide/common";

import { AmqpOrganization, AmqpUser } from ".";
import { AmqpEvent } from "../interfaces";
import { ModelWithId } from "../../_models";
import {
  InvitationPopulate,
  User,
  UserPopulateType,
} from "../../user/interfaces";

export class AmqpInvitationEvent implements AmqpEvent {
  public acceptedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public createdBy?: AmqpUser;
  public token?: string;
  public user: AmqpUser;
  public organization: AmqpOrganization;
  public role: UserRole;
  public territories: AnyDepartmentCode[];
  public frontendUrl: string;
  public theme: Themes | null;
  public isUpdateCampaignOn: boolean;

  constructor(
    invitation: InvitationPopulate,
    frontendUrl: string,
    theme: Themes | null,
    userWhoInvited?: UserPopulateType | ModelWithId<User>,
    isUpdateCampaignOn?: boolean
  ) {
    this.user = new AmqpUser(invitation.user);
    this.acceptedAt = invitation.acceptedAt;
    this.createdAt = invitation.createdAt;
    this.updatedAt = invitation.updatedAt;
    this.createdBy = userWhoInvited ? new AmqpUser(userWhoInvited) : undefined;
    this.token = invitation.token ?? undefined;
    this.organization = new AmqpOrganization(invitation.organization);
    this.role = invitation.roleType;
    this.territories = invitation.territories;
    this.frontendUrl = frontendUrl;
    this.theme = theme;
    this.isUpdateCampaignOn = !!isUpdateCampaignOn;
  }
}
