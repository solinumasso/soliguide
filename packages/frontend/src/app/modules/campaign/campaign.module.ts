import { DragDropModule } from "@angular/cdk/drag-drop";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { CampaignRoutingModule } from "./campaign-routing.module";

import { CampaignFormClosedComponent } from "./components/campaign-form-closed/campaign-form-closed.component";
import { CampaignFormHoursComponent } from "./components/campaign-form-hours/campaign-form-hours.component";
import { CampaignFormInfosComponent } from "./components/campaign-form-infos/campaign-form-infos.component";
import { CampaignFormPlaceComponent } from "./components/campaign-form-place/campaign-form-place.component";
import { CampaignFormServicesComponent } from "./components/campaign-form-services/campaign-form-services.component";
import { CampaignManagePlacesComponent } from "./components/campaign-manage-places/campaign-manage-places.component";

import { CampaignService } from "./services/campaign.service";

import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";
import { CampaignSharedModule } from "../campaign-shared/campaign-shared.module";
import { FormPlaceModule } from "../form-place/form-place.module";
import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { PlacePageModule } from "../place-page/place-page.module";

@NgModule({
  declarations: [
    CampaignFormClosedComponent,
    CampaignFormHoursComponent,
    CampaignFormInfosComponent,
    CampaignFormPlaceComponent,
    CampaignFormServicesComponent,
    CampaignManagePlacesComponent,
  ],
  imports: [
    CampaignRoutingModule,
    CKEditorModule,
    AdminPlaceSharedModule,
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormPlaceModule,
    FormsModule,
    NgbModule,
    PlaceModule,
    PlacePageModule,
    DisplayHorairesComponent,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    CampaignSharedModule,
  ],
  providers: [CampaignService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignModule {} // skipcq: JS-0327
