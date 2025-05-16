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
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbAccordionModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";
import { ManageCommonModule } from "../manage-common/manage-common.module";
import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";

import { CheckPlaceChangesComponent } from "./components/check-place-changes/check-place-changes.component";
import { DisplayPlaceChangesComponent } from "./components/display-place-changes/display-place-changes.component";
import { DisplayChangesAdminPlaceComponent } from "./components/display-changes-admin-place/display-changes-admin-place.component";
import { ManagePlaceChangesComponent } from "./components/manage-place-changes/manage-place-changes.component";
import { PlaceChangesPageComponent } from "./components/place-changes-page/place-changes-page.component";

import { FicheChangesRoutingModule } from "./place-changes-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { PlaceHistoryComponent } from "./components/place-history/place-history.component";
import { DisplayPlaceChangesSectionsComponent } from "./components/display-place-changes-sections/display-place-changes-sections.component";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";

@NgModule({
  declarations: [
    CheckPlaceChangesComponent,
    DisplayPlaceChangesComponent,
    DisplayChangesAdminPlaceComponent,
    ManagePlaceChangesComponent,
    PlaceChangesPageComponent,
    PlaceHistoryComponent,
    DisplayPlaceChangesSectionsComponent,
  ],
  exports: [DisplayChangesAdminPlaceComponent],
  imports: [
    AdminPlaceSharedModule,
    CommonModule,
    FicheChangesRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ManageCommonModule,
    NgbModule,
    PlaceModule,
    SharedModule,
    TranslateModule,
    NgbAccordionModule,
    DisplayHorairesComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FicheChangesModule {}
