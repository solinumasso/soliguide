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
import { Component, Input, OnInit } from "@angular/core";

import {
  Categories,
  TempInfoType,
  ServiceSaturation,
  getCategoriesSpecificFields,
} from "@soliguide/common";

import {
  CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED,
  CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE,
  Service,
  THEME_CONFIGURATION,
} from "../../../../models";
import { FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS } from "../../../../shared/constants/FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS.const";

@Component({
  selector: "app-display-service-admin",
  templateUrl: "./display-service-admin.component.html",
  styleUrls: ["./display-service-admin.component.css"],
})
export class DisplayServiceAdminComponent implements OnInit {
  public isCategoryExist: boolean;

  @Input() public service!: Service;
  @Input() public index!: number;
  @Input() public specificField!: string;
  @Input() public forceDisplayTempInfo = false;

  public readonly ServiceSaturation = ServiceSaturation;
  public readonly TempInfoType = TempInfoType;
  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED =
    CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED;
  public readonly FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS =
    FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS;
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE =
    CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE;

  public ngOnInit(): void {
    // These fields have to be displayed only in manage
    this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE.forEach(
      (field) => {
        if (
          !this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.includes(field)
        ) {
          this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.push(field);
        }
      }
    );

    this.isCategoryExist = Object.values(Categories).includes(
      this.service.category
    );
  }
}
