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
import { AdminSearchPlaces } from "../../../classes";
import { UpdatedAtInterval } from "@soliguide/common";

@Component({
  selector: "app-updated-at-filter",
  templateUrl: "./updated-at-filter.component.html",
  styleUrls: ["./updated-at-filter.component.scss"],
})
export class UpdatedAtFilterComponent implements OnInit {
  @Input() public search: AdminSearchPlaces;
  @Input() public loading: boolean;
  @Output() public readonly launchSearch = new EventEmitter<void>();

  public date: Date | null = null;

  public readonly UpdatedAtInterval = UpdatedAtInterval;

  public ngOnInit() {
    if (this.search?.updatedByUserAt?.value) {
      this.date = this.search.updatedByUserAt.value;
    } else {
      this.date = null;
    }
  }

  public resetDate(): void {
    this.search.updatedByUserAt.intervalType = null;
    this.search.updatedByUserAt.value = null;
  }

  public setDate(): void {
    this.search.updatedByUserAt.value = this.date
      ? new Date(this.date.toString())
      : null;

    this.launchSearch.emit();
  }
}
