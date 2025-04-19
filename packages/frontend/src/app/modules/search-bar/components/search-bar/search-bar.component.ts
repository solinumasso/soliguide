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

import type { LocationAutoCompleteAddress } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";
import { Search } from "../../../search/interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent {
  @Input() public search!: Search;
  // Selected category
  @Output()
  public readonly updateCategory = new EventEmitter<void>();
  // Searched term
  @Output()
  public readonly updateSearchTerm = new EventEmitter<void>();
  // Searched location
  @Output()
  public readonly updateLocation =
    new EventEmitter<LocationAutoCompleteAddress>();

  // Search launched
  @Output()
  public readonly launchSearch = new EventEmitter<void>();

  constructor(private readonly posthogService: PosthogService) {}

  public localLaunchSearch() {
    this.launchSearch.emit();
    this.captureEvent("search-input", { search: this.search });
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(
      `home-search-bar-${eventName.toLocaleLowerCase()}`,
      { ...properties }
    );
  }
}
