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
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { CampaignRoutingModule } from "./campaign-routing.module";

import { CampaignFormClosedComponent } from "./components/campaign-form-closed/campaign-form-closed.component";
import { CampaignFormHoursComponent } from "./components/campaign-form-hours/campaign-form-hours.component";
import { CampaignFormInfosComponent } from "./components/campaign-form-infos/campaign-form-infos.component";
import { CampaignFormPlaceComponent } from "./components/campaign-form-place/campaign-form-place.component";
import { CampaignFormServicesComponent } from "./components/campaign-form-services/campaign-form-services.component";
import { CampaignManagePlacesComponent } from "./components/campaign-manage-places/campaign-manage-places.component";

import { CampaignService } from "./services/campaign.service";

import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";
import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";
import { FormPlaceModule } from "../form-place/form-place.module";
import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { PlacePageModule } from "../place-page/place-page.module";

@NgModule({
  declarations: [
    CampaignFormClosedComponent,
    CampaignFormHoursComponent,
    CampaignFormInfosComponent,
    CampaignFormPlaceComponent,
    CampaignFormServicesComponent,
    CampaignManagePlacesComponent,
  ],
  imports: [
    CampaignRoutingModule,
    CKEditorModule,
    AdminPlaceSharedModule,
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormPlaceModule,
    FormsModule,
    NgbModule,
    PlaceModule,
    PlacePageModule,
    DisplayHorairesComponent,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    CampaignSharedModule,
  ],
  providers: [CampaignService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignModule {} // skipcq: JS-0327
