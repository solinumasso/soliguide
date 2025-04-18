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
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CampaignChangesSection,
  CampaignName,
  CampaignSource,
} from "../../campaign";
import { AnyDepartmentCode, SoliguideCountries } from "../../location";
import { PlaceChangesSection, PlaceChangesStatus } from "../enums";
import { CommonUserForLogs } from "./CommonUserForLogs.interface";

export interface CommonPlaceChanges {
  _id?: string;
  lieu_id: number;
  source: CampaignSource | null;
  section: PlaceChangesSection | CampaignChangesSection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  old: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new: any | null;
  userData: CommonUserForLogs;
  userName: string;
  noChanges: boolean;
  status: PlaceChangesStatus | null;
  createdAt: Date;
  updatedAt: Date;
  isCampaign: boolean;
  country?: SoliguideCountries;
  territory: AnyDepartmentCode | null;
  campaignName: CampaignName | null;
  place?: any;
}
