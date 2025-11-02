/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlaceService } from "../place/services/place.service";
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxJsonLdModule } from "@ngx-lite/json-ld";
import { TranslateModule } from "@ngx-translate/core";
import { ShareButtons } from "ngx-sharebuttons/buttons";
import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { SearchMapComponent } from "../place/standalone-components/search-map/search-map.component";
import { SharedModule } from "../shared";
import { PlacePageRoutingModule } from "./place-page-routing.module";
import { PlaceComponent } from "./components/place/place.component";
import { PlaceModule } from "../place/place.module";
import { DisplayTempBannerComponent } from "../place/standalone-components/display-temp-banner/display-temp-banner.component";
import { DisplayHolidaysComponent } from "../place/standalone-components/display-holidays/display-holidays.component";

@NgModule({
  declarations: [PlaceComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    NgxJsonLdModule,
    PlacePageRoutingModule,
    SharedModule,
    ShareButtons,
    SearchMapComponent,
    PlaceModule,
    HttpClientModule,
    TranslateModule,
    CampaignSharedModule,
    DisplayHorairesComponent,
    DisplayTempBannerComponent,
    DisplayHolidaysComponent,
  ],
  exports: [PlaceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [PlaceService],
})
export class PlacePageModule {}
