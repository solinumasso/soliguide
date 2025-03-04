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
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { NoResultComponent } from "./components/no-result/no-result.component";
import { ResultsInfoBannerComponent } from "./components/results-info-banner/results-info-banner.component";
import { SearchComponent } from "./components/search/search.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { SearchCategoryAutocompleteComponent } from "./components/search-category-autocomplete/search-category-autocomplete.component";
import { SearchFiltersComponent } from "./components/search-filters/search-filters.component";
import { SearchNavComponent } from "./components/search-nav/search-nav.component";
import { SearchPlaceResultComponent } from "./components/search-place-result/search-place-result.component";
import { TempOpenFilterComponent } from "./components/temp-open-filter/temp-open-filter.component";

import { SearchService } from "./services/search.service";

import { SearchRoutingModule } from "./search-routing.module";

import { PlaceModule } from "../place/place.module";

import { SharedModule } from "../shared/shared.module";
import { PartnersLogosComponent } from "./components/partners-logos/partners-logos.component";
import { HttpClientJsonpModule } from "@angular/common/http";
import { FormatInternationalPhoneNumberPipe } from "../shared/pipes";

@NgModule({
  declarations: [
    NoResultComponent,
    ResultsInfoBannerComponent,
    SearchComponent,
    SearchBarComponent,
    SearchCategoryAutocompleteComponent,
    SearchFiltersComponent,
    SearchNavComponent,
    SearchPlaceResultComponent,
    TempOpenFilterComponent,
    PartnersLogosComponent,
  ],
  exports: [
    SearchCategoryAutocompleteComponent,
    SearchBarComponent,
    SearchPlaceResultComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientJsonpModule,
    NgbModule,
    PlaceModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    SharedModule,
    TranslateModule,
    FormatInternationalPhoneNumberPipe,
  ],
  providers: [SearchService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SearchModule {}
