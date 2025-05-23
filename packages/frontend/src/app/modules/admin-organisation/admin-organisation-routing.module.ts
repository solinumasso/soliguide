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
import { FormOrganisationComponent } from "./components/form-organisation/form-organisation.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminOrganisationComponent } from "./components/admin-organisation/admin-organisation.component";
import { AddPlaceToOrgaComponent } from "./components/add-place-to-orga/add-place-to-orga.component";
import { ManageOrganisationsComponent } from "./components/manage-organisations/manage-organisations.component";
import { InviteMemberComponent } from "./components/invite-member/invite-member.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { CanCreateGuard } from "../../guards/can-create.guard";

export const adminOrganisationRoutes: Routes = [
  {
    path: "",
    redirectTo: "manage",
    pathMatch: "full",
  },
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManageOrganisationsComponent,
  },
  {
    path: "new",
    canActivate: [AdminSoliguideGuard],
    component: FormOrganisationComponent,
  },
  {
    path: "edit/:id",
    canActivate: [CanCreateGuard],
    component: FormOrganisationComponent,
  },
  {
    path: "ajouter-lieu/:id",
    canActivate: [AdminSoliguideGuard],
    component: AddPlaceToOrgaComponent,
  },
  {
    path: "inviter-membre/:id",
    canActivate: [CanCreateGuard],
    component: InviteMemberComponent,
  },
  {
    path: ":id",
    component: AdminOrganisationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminOrganisationRoutes)],
  exports: [RouterModule],
})
export class AdminOrganisationRoutingModule {} // skipcq: JS-0327
