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
import { ManageTradPlacesComponent } from "./components/manage-trad-places/manage-trad-places.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditTradFieldComponent } from "./components/edit-trad-field/edit-trad-field.component";

import { ManageTradFieldsComponent } from "./components/manage-trad-fields/manage-trad-fields.component";

export const manageRoutes: Routes = [
  {
    path: "",
    component: ManageTradFieldsComponent,
  },
  {
    path: "places",
    component: ManageTradPlacesComponent,
  },
  {
    path: "edit-field/:id/:lang",
    component: EditTradFieldComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(manageRoutes)],
  exports: [RouterModule],
})
export class TranslationsRoutingModule {} // skipcq: JS-0327
