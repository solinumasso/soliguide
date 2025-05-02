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
import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { DisplayGeneralInfoAdminComponent } from "./components/display-general-info-admin/display-general-info-admin.component";
import { DisplayInvitationComponent } from "./components/display-invitation/display-invitation.component";
import { DisplayLanguagesAdminComponent } from "./components/display-languages-admin/display-languages-admin.component";
import { DisplayModalitiesComponent } from "./components/display-modalities/display-modalities.component";
import { DisplayPositionAdminComponent } from "./components/display-position-admin/display-position-admin.component";
import { DisplayPublicAdminComponent } from "./components/display-public-admin/display-public-admin.component";
import { DisplayServiceAdminComponent } from "./components/display-service-admin/display-service-admin.component";
import { DisplayTempInfoAdminComponent } from "./components/display-temp-info-admin/display-temp-info-admin.component";

import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";
import { FormatInternationalPhoneNumberPipe } from "../shared";

@NgModule({
  declarations: [
    DisplayGeneralInfoAdminComponent,
    DisplayInvitationComponent,
    DisplayLanguagesAdminComponent,
    DisplayModalitiesComponent,
    DisplayServiceAdminComponent,
    DisplayPositionAdminComponent,
    DisplayPublicAdminComponent,
    DisplayTempInfoAdminComponent,
  ],
  exports: [
    DisplayGeneralInfoAdminComponent,
    DisplayInvitationComponent,
    DisplayLanguagesAdminComponent,
    DisplayModalitiesComponent,
    DisplayPositionAdminComponent,
    DisplayPublicAdminComponent,
    DisplayServiceAdminComponent,
    DisplayTempInfoAdminComponent,
  ],
  imports: [
    ClipboardModule,
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    PlaceModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    FormatInternationalPhoneNumberPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPlaceSharedModule {}
