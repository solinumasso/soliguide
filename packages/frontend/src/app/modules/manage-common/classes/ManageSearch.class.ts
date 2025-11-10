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
  AnyDepartmentCode,
  ManageSearchOptions,
  SoliguideCountries,
} from "@soliguide/common";

import { initSearchAdminTerritory } from "../../../shared";
import { THEME_CONFIGURATION } from "../../../models/themes";
import type { User } from "../../users/classes";

export class ManageSearch {
  public options: ManageSearchOptions;
  public country: SoliguideCountries;
  public territories: AnyDepartmentCode[];

  constructor(
    data?: {
      options?: Partial<ManageSearchOptions>;
      territories?: AnyDepartmentCode[];
    },
    user?: User
  ) {
    this.country = THEME_CONFIGURATION.country;
    this.options = new ManageSearchOptions(data);
    this.territories = initSearchAdminTerritory(data?.territories, user);
  }

  public sort(options: ManageSearchOptions, value: string): void {
    if (value.toString() === options.sortBy.toString()) {
      this.options.sortValue = -this.options.sortValue;
    }
    this.options.sortBy = value;
    this.options.page = 1;
  }

  public resetSearchElement(key: string): void {
    // Valeure contenue dans un objet ?
    const mySplit = key.split(".");
    if (mySplit.length > 1) {
      this[mySplit[0]][mySplit[1]] = null;
    } else {
      this[key] = null;
    }
    this.options.page = 1;
  }
}
