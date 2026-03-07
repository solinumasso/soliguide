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
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { DisplayTempBannerComponent } from "../place/standalone-components/display-temp-banner/display-temp-banner.component";

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
    DisplayHorairesComponent,
    DisplayTempBannerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPlaceSharedModule {}
