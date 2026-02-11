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
import { AnyDepartmentCode } from "../../location";
import { Phone } from "../../phone";
import { OperationalAreas } from "../../users";
import { Relations } from "../types";

export interface ApiOrganization {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  counters: {
    invitations: {
      EDITOR: number;
      OWNER: number;
      READER: number;
      TOTAL: number;
    };
    users: {
      EDITOR: number;
      OWNER: number;
      READER: number;
      TOTAL: number;
    };
  };
  description: string;
  facebook: string;
  fax: string | null;
  logo: string;
  mail: string;
  name: string;
  organization_id: number;
  phone: Phone | null;
  priority: boolean;
  relations: Relations[];
  // @deprecated: delete when data team is up to date
  territories: AnyDepartmentCode[];
  verified: {
    date: Date;
    status: boolean;
  };
  website: string | null;
  places: any[];
  roles: any[];
  users: any[];
  invitations: any[];
  campaigns?: any;
  areas: OperationalAreas;
  lastLogin: Date | null;
}
