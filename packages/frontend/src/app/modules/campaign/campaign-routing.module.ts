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
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CampaignFormPlaceComponent } from "./components/campaign-form-place/campaign-form-place.component";
import { CampaignManagePlacesComponent } from "./components/campaign-manage-places/campaign-manage-places.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";

export const campaignRoutes: Routes = [
  {
    path: "",
    component: CampaignManagePlacesComponent,
  },
  {
    path: "fiche/:lieu_id",
    component: CampaignFormPlaceComponent,
  },
  {
    path: "orga/:organization_id",
    canActivate: [AdminSoliguideGuard],
    component: CampaignManagePlacesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(campaignRoutes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {} // skipcq: JS-0327
