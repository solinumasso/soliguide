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
import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlaceChangesPageComponent } from "./components/place-changes-page/place-changes-page.component";

import { CanReadChangeGuard } from "../../guards/can-read-change.guard";
import { ManagePlaceChangesComponent } from "./components/manage-place-changes/manage-place-changes.component";
import { CanEditGuard } from "../../guards/can-edit.guard";
import { PlaceHistoryComponent } from "./components/place-history/place-history.component";

export const ficheChangesRoutes: Routes = [
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManagePlaceChangesComponent,
  },
  {
    path: "place/:lieu_id",
    canActivate: [CanEditGuard],
    component: PlaceHistoryComponent,
  },
  {
    path: "version/:placeChangesObjectId",
    canActivate: [CanReadChangeGuard],
    component: PlaceChangesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ficheChangesRoutes)],
  exports: [RouterModule],
})
export class FicheChangesRoutingModule {} // skipcq: JS-0327
