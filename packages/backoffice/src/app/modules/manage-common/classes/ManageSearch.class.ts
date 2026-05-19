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
