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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { KeyStringValueString } from "@soliguide/common";
@Component({
  selector: "app-manage-multiple-select",
  templateUrl: "./manage-multiple-select.component.html",
  styleUrls: ["./manage-multiple-select.component.css"],
})
export class ManageMultipleSelectComponent implements OnInit {
  @Input() public allOptionsLabel: string;
  @Input() public anyOptionLabel: string;
  @Input() public label: string;
  @Input() public options: string[];
  @Input() public optionLabels: KeyStringValueString;

  public allOptions: number;

  @Output() public readonly selectedOptions = new EventEmitter<string[]>();

  public ngOnInit(): void {
    this.allOptions = Object.keys(this.optionLabels).length;
  }

  public getStringToDisplay = (): string => {
    let displayValue = "";

    if (this.options?.length === this.allOptions) {
      return this.allOptionsLabel;
    } else if (!this.options || this.options.length === 0) {
      return this.anyOptionLabel;
    }

    this.options.forEach((option) => {
      if (this.options.includes(option)) {
        displayValue =
          displayValue.length !== 0
            ? displayValue.concat(", ", this.optionLabels[option])
            : displayValue.concat(this.optionLabels[option]);
      }
    });

    return displayValue;
  };

  public toggleCheckboxButton(key: string): void {
    if (key === "ALL") {
      if (this.options.length !== this.allOptions) {
        this.options = [];
        for (const option in this.optionLabels) {
          this.options.push(option);
        }
      } else {
        this.options = [];
      }
    } else {
      const index = this.options.indexOf(key);

      if (index !== -1) {
        this.options.splice(index, 1);
      } else {
        this.options.push(key);
      }
    }

    this.selectedOptions.emit(this.options);
  }
}
