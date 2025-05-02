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

import { FormHorairesComponent } from "./components/horaires/form-horaires.component";

import { InfosComponent } from "./components/infos/infos.component";

import { ModalitiesComponent } from "./components/modalities/modalities.component";
import { PhotosComponent } from "./components/photos/photos.component";
import { PublicsFormComponent } from "./components/publics-form/publics-form.component";
import { FormServicesComponent } from "./components/services-form/form-services.component";

import { CanCreateGuard } from "../../guards/can-create.guard";
import { CanEditGuard } from "../../guards/can-edit.guard";
import { PendingChangesGuard } from "../../guards/pending-changes.guard";
import { EditContactsFormComponent } from "./components/edit-contacts-form/edit-contacts-form.component";
import { PlaceEmplacementFormComponent } from "./components/place-emplacement-form/place-emplacement-form.component";

import { ParentTempInfosFormComponent } from "./components/temp-infos-forms/parent-temp-infos-form/parent-temp-infos-form.component";

export const formPlaceRoutes: Routes = [
  {
    path: "infos",
    canActivate: [CanCreateGuard],
    component: InfosComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "infos/organization/:orgaObjectId",
    canActivate: [CanCreateGuard],
    component: InfosComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "infos/:lieu_id",
    canActivate: [CanEditGuard],
    component: InfosComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "contacts/:lieu_id",
    canActivate: [CanEditGuard],
    component: EditContactsFormComponent,
  },
  {
    path: "emplacement/:lieu_id",
    canActivate: [CanEditGuard],
    component: PlaceEmplacementFormComponent,
  },
  {
    path: "horaires/:lieu_id",
    canActivate: [CanEditGuard],
    component: FormHorairesComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "public/:lieu_id",
    canActivate: [CanEditGuard],
    component: PublicsFormComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "condition/:lieu_id",
    canActivate: [CanEditGuard],
    component: ModalitiesComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "services/:lieu_id",
    canActivate: [CanEditGuard],
    component: FormServicesComponent,
    canDeactivate: [PendingChangesGuard],
  },

  {
    path: "photos/:lieu_id",
    canActivate: [CanEditGuard],
    component: PhotosComponent,
  },
  // Nouveaux horaires & message
  {
    path: "temp-infos/:tempInfoType/:lieu_id",
    canActivate: [CanEditGuard],
    component: ParentTempInfosFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(formPlaceRoutes)],
  exports: [RouterModule],
})
export class FormPlaceRoutingModule {} // skipcq: JS-0327
