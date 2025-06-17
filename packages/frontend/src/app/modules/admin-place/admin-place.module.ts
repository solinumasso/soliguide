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
import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { AdminPlaceRoutingModule } from "./admin-place-routing.module";

import { AdminPlaceComponent } from "./components/admin-place/admin-place.component";
import { AutoExportOptionComponent } from "./components/auto-export-place/auto-export-option/auto-export-option.component";
import { AutoExportPlaceComponent } from "./components/auto-export-place/auto-export-place.component";
import { DeletePlaceComponent } from "./components/delete-place/delete-place.component";
import { DuplicatePlaceComponent } from "./components/duplicate-place/duplicate-place.component";
import { HelperNotificationComponent } from "./components/helper-notification/helper-notification.component";
import { ExcludePlacesFilterComponent } from "./components/manage-places/exclude-places-filter/exclude-places-filter.component";
import { UpdatedAtFilterComponent } from "./components/manage-places/updated-at-filter/updated-at-filter.component";
import { ManagePlacesComponent } from "./components/manage-places/manage-places.component";

import { ManagePlacesService } from "./services/manage-places.service";

import { AdminOrganisationModule } from "../admin-organisation/admin-organisation.module";
import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";
import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";
import { FicheChangesModule } from "../place-changes/place-changes.module";
import { ManageCommonModule } from "../manage-common/manage-common.module";
import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";
import { HttpClientJsonpModule } from "@angular/common/http";
import { LocationAutocompleteComponent } from "../shared/components/location-autocomplete/location-autocomplete.component";
import { SearchMapComponent } from "../place/standalone-components/search-map/search-map.component";
import { SearchBarModule } from "../search-bar/search-bar.module";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { DisplayTempBannerComponent } from "../place/standalone-components/display-temp-banner/display-temp-banner.component";

@NgModule({
  declarations: [
    AdminPlaceComponent,
    AutoExportOptionComponent,
    AutoExportPlaceComponent,
    DeletePlaceComponent,
    DuplicatePlaceComponent,
    ExcludePlacesFilterComponent,
    HelperNotificationComponent,
    ManagePlacesComponent,
    UpdatedAtFilterComponent,
  ],
  exports: [DeletePlaceComponent, HelperNotificationComponent],
  imports: [
    AdminPlaceRoutingModule,
    AdminOrganisationModule,
    AdminPlaceSharedModule,
    CampaignSharedModule,
    CommonModule,
    DragDropModule,
    FicheChangesModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientJsonpModule,
    ManageCommonModule,
    NgbModule,
    PlaceModule,
    SharedModule,
    TranslateModule,
    DisplayHorairesComponent,
    LocationAutocompleteComponent,
    SearchMapComponent,
    SearchBarModule,
    DisplayTempBannerComponent,
  ],
  providers: [ManagePlacesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AdminPlaceModule {}
