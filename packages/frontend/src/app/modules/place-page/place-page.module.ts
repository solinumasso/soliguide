import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PlaceService],
})
export class PlacePageModule {} // skipcq JS-0327
