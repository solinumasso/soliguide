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
import { TranslateService } from "@ngx-translate/core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  Categories,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
  getCategoryTranslationKey,
} from "@soliguide/common";

@Component({
  selector: "app-exclude-places-filter",
  templateUrl: "./exclude-places-filter.component.html",
  styleUrls: ["./exclude-places-filter.component.css"],
})
export class ExcludePlacesFilterComponent implements OnInit {
  @Input() public categoriesToExclude: Categories[];

  public readonly DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION =
    DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION;

  @Output() public readonly selectedCatToExclude = new EventEmitter<
    Categories[]
  >();

  public constructor(private readonly translateService: TranslateService) {
    this.categoriesToExclude = [];
  }

  public ngOnInit(): void {
    if (!this.categoriesToExclude) {
      this.categoriesToExclude = [];
    }
  }

  public getStringToDisplay(): string {
    let displayValue = "";

    if (this.categoriesToExclude.length === 0) {
      return this.translateService.instant("NO_CATEGORY");
    }

    this.categoriesToExclude.forEach((category) => {
      const label = this.translateService.instant(
        getCategoryTranslationKey(category)
      );

      if (this.categoriesToExclude.includes(category)) {
        displayValue =
          displayValue.length !== 0
            ? displayValue.concat(", ", label)
            : displayValue.concat(label);
      }
    });

    return displayValue;
  }

  public toggleCheckboxButton(key: Categories): void {
    const index = this.categoriesToExclude.indexOf(key);

    if (index !== -1) {
      this.categoriesToExclude.splice(index, 1);
    } else {
      this.categoriesToExclude.push(key);
    }
    this.selectedCatToExclude.emit(this.categoriesToExclude);
  }
}
