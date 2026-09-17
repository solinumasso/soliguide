import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";

import { CampaignTempFormsRoutingModule } from "./campaign-temp-forms-routing.module";
import { CampaignClimateSummerComponent } from "./pages/campaign-climate-summer/campaign-climate-summer.component";

@NgModule({
  declarations: [CampaignClimateSummerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    TranslateModule,
    CampaignTempFormsRoutingModule,
  ],
})
export class CampaignTempFormsModule {} // skipcq: JS-0327
