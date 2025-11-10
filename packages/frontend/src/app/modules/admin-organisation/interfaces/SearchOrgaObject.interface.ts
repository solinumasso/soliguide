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
  RelationsSearch,
  UserTypes,
  RELATIONS_SEARCH,
  type AnyDepartmentCode,
  ManageSearchOptions,
} from "@soliguide/common";
import { type OrgaCampaignStatus } from "../../../models";
import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchOrgaObject extends ManageSearch {
  public name: string | null;
  public organization_id: number | null;
  public admin?: string;
  public toCampaignUpdate?: boolean;
  public campaignStatus?: OrgaCampaignStatus;
  public lieu_id?: number;

  public relations: RelationsSearch[];
  public userTypes: UserTypes[];
  public priority?: boolean;

  constructor(
    data?:
      | Partial<SearchOrgaObject>
      | {
          options?: Partial<ManageSearchOptions>;
          territories?: AnyDepartmentCode[];
        },
    user?: User
  ) {
    super(data, user);
    const searchOrgaObject: Partial<SearchOrgaObject> | undefined = data as
      | Partial<SearchOrgaObject>
      | undefined;
    this.organization_id = searchOrgaObject?.organization_id ?? null;
    this.name = searchOrgaObject?.name ?? null;
    this.campaignStatus = searchOrgaObject?.campaignStatus ?? undefined;
    this.lieu_id = searchOrgaObject?.lieu_id ?? undefined;
    this.admin = searchOrgaObject?.admin ?? undefined;
    this.relations = searchOrgaObject?.relations ?? RELATIONS_SEARCH;
    this.userTypes = searchOrgaObject?.userTypes ?? [];
    this.toCampaignUpdate = searchOrgaObject?.toCampaignUpdate ?? undefined;
    this.priority = searchOrgaObject?.priority ?? undefined;
  }
}
