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
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { ManageUsersComponent } from "./components/manage-users/manage-users.component";
import { ManageApiUsersComponent } from "./components/manage-api-users/manage-api-users.component";
import { AdminUserComponent } from "./components/admin-user/admin-user.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";

export const adminUsersRoutes: Routes = [
  {
    path: "",
    redirectTo: "manage",
    pathMatch: "full",
  },
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManageUsersComponent,
  },
  {
    path: "manage-api-users",
    canActivate: [AdminSoliguideGuard],
    component: ManageApiUsersComponent,
  },
  {
    path: ":id",
    component: AdminUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminUsersRoutes)],
  exports: [RouterModule],
})
export class AdminUsersRoutingModule {} // skipcq: JS-0327
