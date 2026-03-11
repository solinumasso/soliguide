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
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { GoogleMapPocComponent } from "./components/map-comparison/google-map/google-map-poc.component";
import { LeafletMapPocComponent } from "./components/map-comparison/leaflet-map/leaflet-map-poc.component";
import { MapComparisonComponent } from "./components/map-comparison/map-comparison.component";
import { PocRoutingModule } from "./poc-routing.module";

@NgModule({
  declarations: [MapComparisonComponent],
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapPocComponent,
    LeafletMapPocComponent,
    PocRoutingModule,
  ],
})
export class PocModule {}
