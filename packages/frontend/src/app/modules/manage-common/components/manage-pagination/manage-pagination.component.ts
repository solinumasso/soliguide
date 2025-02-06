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
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ManageSearchOptions } from "@soliguide/common";

@Component({
  selector: "app-manage-pagination",
  templateUrl: "./manage-pagination.component.html",
  styleUrls: ["./manage-pagination.component.css"],
})
export class ManagePaginationComponent {
  @Input() public nbResults = 0;
  @Output() public readonly launchSearch = new EventEmitter<void>();

  @Input() public options: ManageSearchOptions;
  @Output() public readonly optionsChange =
    new EventEmitter<ManageSearchOptions>();

  public updateOptions() {
    this.launchSearch.emit();
    this.optionsChange.emit(this.options);
  }
}
