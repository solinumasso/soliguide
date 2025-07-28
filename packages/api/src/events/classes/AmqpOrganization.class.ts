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
import type {
  ApiOrganization,
  AnyDepartmentCode,
  Phone,
  Relations,
} from "@soliguide/common";

import type { ModelWithId } from "../../_models";
import { extractTerritoriesAndCountryFromAreas } from "../../user/utils/getTerritoriesFromAreas";

export class AmqpOrganization {
  public createdAt?: Date;
  public updatedAt?: Date;
  public name: string;
  public organization_id: number;
  public email?: string;
  public phone?: Phone;
  public territories?: AnyDepartmentCode[];
  public priority: boolean;
  public relations: Relations[];
  public website?: string;

  constructor(
    organization: ApiOrganization | ModelWithId<Omit<ApiOrganization, "_id">>
  ) {
    this.name = organization.name;
    this.organization_id = organization.organization_id;
    this.email = organization.mail ?? undefined;
    this.phone = organization.phone ?? undefined;
    this.territories = extractTerritoriesAndCountryFromAreas(
      organization.areas
    ).territories;
    this.priority = organization.priority;
    this.relations = organization.relations;
    this.website = organization.website ?? undefined;
    this.createdAt = organization.createdAt;
    this.updatedAt = organization.updatedAt;
  }
}
