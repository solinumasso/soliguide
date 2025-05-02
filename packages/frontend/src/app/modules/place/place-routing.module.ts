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

import { PlaceComponent } from "./components/place/place.component";

import { LanguageGuard } from "../../guards/language.guard";
import { THEME_CONFIGURATION } from "../../models";

export const placeRoutes: Routes = [
  {
    path: "fiche/:lieu_id",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/fiche/:lieu_id`,
  },
  {
    path: ":lang/fiche/:lieu_id",
    canActivate: [LanguageGuard],
    component: PlaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(placeRoutes)],
  exports: [RouterModule],
})
export class PlaceRoutingModule {} // skipcq: JS-0327
