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
import {
  CommonUserForLogs,
  PlaceChangesSection,
  PlaceChangesStatus,
  UserStatus,
} from "@soliguide/common";

import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchPlaceChanges extends ManageSearch {
  public isCampaign: boolean | null;
  public lieu_id: number | null;
  public section: PlaceChangesSection | null;
  public status: PlaceChangesStatus | null;
  public userData?: Partial<CommonUserForLogs>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.isCampaign = data?.isCampaign ?? null;
    this.lieu_id = data?.lieu_id ?? null;
    this.section = data?.section ?? null;
    this.status = data?.status ?? null;

    this.userData = data?.userData ?? {
      email: null,
      orgaId: null,
      orgaName: null,
      status: UserStatus.PRO,
      territory: null,
    };
  }
}
