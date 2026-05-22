import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { CountUpModule } from "ngx-countup";

import { ContactComponent } from "./components/contact/contact.component";
import { DevenirBenevoleComponent } from "./components/devenir-benevole/devenir-benevole.component";
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/nav/nav.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { DownloadMobileAppComponent } from "./components/download-mobile-app/download-mobile-app.component";
import { FooterComponent } from "./components/footer/footer.component";
import { GeneralService } from "./services/general.services";

import { SharedModule } from "../shared/shared.module";
import { ChatService } from "../shared/services";

import { HomeTerritoriesStatsComponent } from "./components/home-territiries-stats/home-territories-stats.component";
import { SearchBarModule } from "../search-bar/search-bar.module";
import { PartnersBannerComponent } from "./components/partners-banner/partners-banner.component";
import { SearchCategoryAutocompleteComponent } from "../shared/components/search-category-autocomplete/search-category-autocomplete.component";

@NgModule({
  declarations: [
    ContactComponent,
    DevenirBenevoleComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    DownloadMobileAppComponent,
    HomeTerritoriesStatsComponent,
    PartnersBannerComponent,
  ],
  exports: [
    HomeComponent,
    NotFoundComponent,
    NavComponent,
    FooterComponent,
    DownloadMobileAppComponent,
    HomeTerritoriesStatsComponent,
    PartnersBannerComponent,
  ],
  imports: [
    CommonModule,
    CountUpModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    SearchBarModule,
    SearchCategoryAutocompleteComponent,
    SharedModule,
    TranslateModule,
  ],
  providers: [GeneralService, ChatService],
})
export class GeneralModule {} // skipcq: JS-0327
