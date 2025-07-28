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
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NgxJsonLdModule } from "@ngx-lite/json-ld";

import { TranslateModule } from "@ngx-translate/core";

import { SingleContactComponent } from "./components/display-contacts/single-contact/single-contact.component";
import { DisplayContactsComponent } from "./components/display-contacts/display-contacts.component";
import { DisplayDocsComponent } from "./components/display-docs/display-docs.component";
import { DisplayEntityInfosComponent } from "./components/display-entity-infos/display-entity-infos.component";
import { DisplayLanguagesComponent } from "./components/display-languages/display-languages.component";
import { DisplayModalitiesInlineComponent } from "./components/display-modalities-inline/display-modalities-inline.component";
import { DisplayParcoursMobileComponent } from "./components/display-parcours-mobile/display-parcours-mobile.component";
import { DisplayPhotosComponent } from "./components/display-photos/display-photos.component";
import { DisplayPlaceInfosComponent } from "./components/display-place-infos/display-place-infos.component";
import { DisplayPublicsInlineComponent } from "./components/display-publics-inline/display-publics-inline.component";
import { DisplayServicesComponent } from "./components/display-services/display-services.component";
import { DisplaySpecificFieldsComponent } from "./components/display-specific-fields/display-specific-fields.component";
import { DisplayTempBannerComponent } from "./standalone-components/display-temp-banner/display-temp-banner.component";
import { PlaceUpdateCampaignBannerComponent } from "./components/place-update-campaign-banner/place-update-campaign-banner.component";

import { SharePlaceComponent } from "./components/share-place/share-place.component";
import { CampaignService } from "../campaign/services/campaign.service";

import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";

import { SharedModule } from "../shared/shared.module";

import { PlaceTransportsComponent } from "./components/place-transports/place-transports.component";
import { DisplayHolidaysComponent } from "./standalone-components/display-holidays/display-holidays.component";
import { HolidaysService } from "./services/holidays.service";
import { HttpClientModule } from "@angular/common/http";
import { ShareButtons } from "ngx-sharebuttons/buttons";
import { SearchMapComponent } from "./standalone-components/search-map/search-map.component";
import { FormatInternationalPhoneNumberPipe } from "../shared";
import { DisplayHorairesComponent } from "./standalone-components/display-horaires/horaires.component";
import { ExternalSourcePlaceCampaignBannerComponent } from "./components/external-source-place-campaign-banner/external-source-place-campaign-banner.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    DisplayContactsComponent,
    DisplayDocsComponent,
    DisplayEntityInfosComponent,
    DisplayLanguagesComponent,
    DisplayModalitiesInlineComponent,
    DisplayParcoursMobileComponent,
    DisplayPhotosComponent,
    DisplayPlaceInfosComponent,
    DisplayPublicsInlineComponent,
    DisplayServicesComponent,
    DisplaySpecificFieldsComponent,
    ExternalSourcePlaceCampaignBannerComponent,
    PlaceTransportsComponent,
    PlaceUpdateCampaignBannerComponent,
    SharePlaceComponent,
    SingleContactComponent,
  ],
  imports: [
    CampaignSharedModule,
    ClipboardModule,
    CommonModule,
    DisplayHolidaysComponent,
    DisplayHorairesComponent,
    DisplayTempBannerComponent,
    FontAwesomeModule,
    FormatInternationalPhoneNumberPipe,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxJsonLdModule,
    RouterModule,
    SearchMapComponent,
    ShareButtons,
    SharedModule,
    TranslateModule,
  ],
  exports: [
    DisplayContactsComponent,
    DisplayDocsComponent,
    DisplayEntityInfosComponent,
    DisplayLanguagesComponent,
    DisplayModalitiesInlineComponent,
    DisplayParcoursMobileComponent,
    DisplayPhotosComponent,
    DisplayPlaceInfosComponent,
    DisplayPublicsInlineComponent,
    DisplayServicesComponent,
    DisplaySpecificFieldsComponent,
    ExternalSourcePlaceCampaignBannerComponent,
    PlaceTransportsComponent,
    PlaceUpdateCampaignBannerComponent,
    SharePlaceComponent,
    SingleContactComponent,
  ],
  providers: [CampaignService, HolidaysService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlaceModule {} // skipcq: JS-0327
