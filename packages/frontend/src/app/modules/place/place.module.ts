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
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NgxJsonLdModule } from "@ngx-lite/json-ld";

import { TranslateModule } from "@ngx-translate/core";

import { ShareButtonModule } from "ngx-sharebuttons/button";

import { SingleContactComponent } from "./components/display-contacts/single-contact/single-contact.component";
import { DisplayContactsComponent } from "./components/display-contacts/display-contacts.component";
import { DisplayDocsComponent } from "./components/display-docs/display-docs.component";
import { DisplayEntityInfosComponent } from "./components/display-entity-infos/display-entity-infos.component";
import { DisplayHorairesComponent } from "./components/display-horaires/horaires.component";
import { DisplayLanguagesComponent } from "./components/display-languages/display-languages.component";
import { DisplayModalitiesInlineComponent } from "./components/display-modalities-inline/display-modalities-inline.component";
import { DisplayParcoursMobileComponent } from "./components/display-parcours-mobile/display-parcours-mobile.component";
import { DisplayPhotosComponent } from "./components/display-photos/display-photos.component";
import { DisplayPlaceInfosComponent } from "./components/display-place-infos/display-place-infos.component";
import { DisplayPublicsInlineComponent } from "./components/display-publics-inline/display-publics-inline.component";
import { DisplayServicesComponent } from "./components/display-services/display-services.component";
import { DisplaySpecificFieldsComponent } from "./components/display-specific-fields/display-specific-fields.component";
import { DisplayTempBannerComponent } from "./components/display-temp-banner/display-temp-banner.component";

import { PlaceComponent } from "./components/place/place.component";
import { PlaceUpdateCampaignBannerComponent } from "./components/place-update-campaign-banner/place-update-campaign-banner.component";

import { SearchMapComponent } from "./components/search-map/search-map.component";

import { SharePlaceComponent } from "./components/share-place/share-place.component";

import { PlaceRoutingModule } from "./place-routing.module";

import { PlaceService } from "./services/place.service";

import { CampaignService } from "../campaign/services/campaign.service";

import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";

import { SharedModule } from "../shared/shared.module";
import { FormatInternationalPhoneNumberPipe } from "../shared/pipes";
import { PlaceTransportsComponent } from "./components/place-transports/place-transports.component";
import { DisplayHolidaysComponent } from "./components/display-holidays/display-holidays.component";
import { HolidaysService } from "./services/holidays.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    DisplayContactsComponent,
    DisplayDocsComponent,
    DisplayEntityInfosComponent,
    DisplayHorairesComponent,
    DisplayLanguagesComponent,
    DisplayModalitiesInlineComponent,
    DisplayParcoursMobileComponent,
    DisplayPhotosComponent,
    DisplayPlaceInfosComponent,
    DisplayPublicsInlineComponent,
    DisplayServicesComponent,
    DisplaySpecificFieldsComponent,
    DisplayTempBannerComponent,
    PlaceComponent,
    PlaceUpdateCampaignBannerComponent,
    SearchMapComponent,
    SharePlaceComponent,
    SingleContactComponent,
    PlaceTransportsComponent,
    DisplayHolidaysComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgxJsonLdModule,
    PlaceRoutingModule,
    ShareButtonModule,
    SharedModule,
    HttpClientModule,
    TranslateModule,
    CampaignSharedModule,
    FormatInternationalPhoneNumberPipe,
  ],
  exports: [
    DisplayContactsComponent,
    DisplayDocsComponent,
    DisplayEntityInfosComponent,
    DisplayHorairesComponent,
    DisplayLanguagesComponent,
    DisplayModalitiesInlineComponent,
    DisplayParcoursMobileComponent,
    DisplayPhotosComponent,
    DisplayPlaceInfosComponent,
    DisplayPublicsInlineComponent,
    DisplayServicesComponent,
    DisplayTempBannerComponent,
    PlaceComponent,
    SearchMapComponent,
    SingleContactComponent,
    DisplaySpecificFieldsComponent,
    DisplayHolidaysComponent,
  ],
  providers: [CampaignService, PlaceService, HolidaysService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PlaceModule {}
