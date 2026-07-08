import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CampaignClimateSummerComponent } from "./pages/campaign-climate-summer/campaign-climate-summer.component";

export const campaignTempFormsRoutes: Routes = [
  {
    path: "campaign-climate-summer/:campaignSlug/:campaignUserUuid",
    component: CampaignClimateSummerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(campaignTempFormsRoutes)],
  exports: [RouterModule],
})
export class CampaignTempFormsRoutingModule {} // skipcq: JS-0327
