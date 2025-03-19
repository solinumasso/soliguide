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
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { CountUpModule } from "ngx-countup";

import { AideComponent } from "./components/aide/aide.component";
import { AideTradComponent } from "./components/aide-trad/aide-trad.component";
import { ContactComponent } from "./components/contact/contact.component";
import { DevenirBenevoleComponent } from "./components/devenir-benevole/devenir-benevole.component";
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/nav/nav.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { DownloadMobileAppComponent } from "./components/download-mobile-app/download-mobile-app.component";
import { FooterComponent } from "./components/footer/footer.component";
import { GeneralService } from "./services/general.services";

import { SearchModule } from "../search/search.module";
import { SharedModule } from "../shared/shared.module";
import { CookiesModalComponent } from "./components/cookies-modal/cookies-modal.component";
import { ChatService } from "../shared/services";
import { OlympicGamesComponent } from "./components/solidata/olympic-games.component";
import { SearchTrackingComponent } from "./components/solidata/search-tracking.component";
import { SeasonalAnalysisComponent } from "./components/solidata/seasonal-analysis.component";
import { TerritorialAnalysisComponent } from "./components/solidata/territorial-analysis.component";
import { HomeTerritoriesStatsComponent } from "./components/home-territiries-stats/home-territories-stats.component";
import { FoodAccessComponent } from "./components/solidata/food-access.component";

@NgModule({
  declarations: [
    AideComponent,
    AideTradComponent,
    ContactComponent,
    DevenirBenevoleComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    CookiesModalComponent,
    DownloadMobileAppComponent,
    OlympicGamesComponent,
    FoodAccessComponent,
    SearchTrackingComponent,
    SeasonalAnalysisComponent,
    TerritorialAnalysisComponent,
    HomeTerritoriesStatsComponent,
  ],
  exports: [
    HomeComponent,
    NotFoundComponent,
    NavComponent,
    FooterComponent,
    DownloadMobileAppComponent,
    CookiesModalComponent,
    HomeTerritoriesStatsComponent,
  ],
  imports: [
    CommonModule,
    CountUpModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    SearchModule,
    SharedModule,
    TranslateModule,
  ],
  providers: [GeneralService, ChatService],
})
export class GeneralModule {} // skipcq: JS-0327
