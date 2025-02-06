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
import { CampaignName } from "@soliguide/common";

import { CampaignEmailType, EmailStatus } from "../types";

import { ManageSearch } from "../../../models/manage-search";
import { User } from "../../users/classes";

export class SearchEmail extends ManageSearch {
  public campaigns?: CampaignName[];
  public lastStatus?: EmailStatus;
  public emailType?: CampaignEmailType;
  public orgaId?: number;
  public recipientEmail?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);

    this.campaigns = data?.campaigns || [];
    this.lastStatus = data?.lastStatus ?? null;
    this.emailType = data?.emailType ?? null;
    this.orgaId = data?.orgaId ?? null;
    this.recipientEmail = data?.recipientEmail ?? null;
    this.territories = data?.territories || [];
  }
}
