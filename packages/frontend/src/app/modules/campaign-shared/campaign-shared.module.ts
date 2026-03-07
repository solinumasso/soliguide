import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { CampaignNoChangeModalComponent } from "./components/campaign-no-change-modal/campaign-no-change-modal.component";
import { CampaignSourceUpdateComponent } from "./components/campaign-source-update/campaign-source-update.component";
import { SharedModule } from "../shared";

@NgModule({
  declarations: [CampaignNoChangeModalComponent, CampaignSourceUpdateComponent],
  exports: [CampaignNoChangeModalComponent, CampaignSourceUpdateComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    SharedModule,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignSharedModule {} // skipcq: JS-0327
