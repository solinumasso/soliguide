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
import { Component, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { LocationService } from "../../../shared/services/location.service";

type MapVersion = "leaflet" | "google";

@Component({
  selector: "app-map-comparison",
  templateUrl: "./map-comparison.component.html",
  styleUrls: ["./map-comparison.component.scss"],
})
export class MapComparisonComponent implements OnDestroy {
  public version: MapVersion = "leaflet";
  public coordinates: { lat: number; lng: number } | null = null;
  public address = "";
  public note = "";
  public isReverseLoading = false;

  private readonly subscription = new Subscription();

  constructor(private readonly locationService: LocationService) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setVersion(version: MapVersion): void {
    this.version = version;
    // Reset address when switching — coordinates stay stable
    this.address = "";
  }

  public onNewCoordinates(coords: { lat: number; lng: number }): void {
    this.coordinates = coords;
    this.address = "";
    this.isReverseLoading = true;

    this.subscription.add(
      this.locationService.reverse(coords.lat, coords.lng).subscribe({
        next: (results) => {
          this.address = results.length > 0 ? results[0].label ?? "" : "";
          this.isReverseLoading = false;
        },
        error: () => {
          this.address = "";
          this.isReverseLoading = false;
        },
      })
    );
  }
}
