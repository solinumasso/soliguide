import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CampaignClimateOrgaComponent } from "./components/campaign-climate-orga/campaign-climate-orga.component";
import { CampaignExceptionalUpdatesComponent } from "./components/campaign-exceptional-updates/campaign-exceptional-updates.component";
import { CampaignFormPlaceComponent } from "./components/campaign-form-place/campaign-form-place.component";
import { CampaignManagePlacesComponent } from "./components/campaign-manage-places/campaign-manage-places.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { SuperAdminGuard } from "../../guards/super-admin.guard";

export const campaignRoutes: Routes = [
  {
    path: "",
    component: CampaignManagePlacesComponent,
  },
  {
    path: "exceptional-updates",
    canActivate: [SuperAdminGuard],
    component: CampaignExceptionalUpdatesComponent,
  },
  {
    path: "climate-summer/:campaignSlug/orga/:orgaObjectId",
    canActivate: [AdminSoliguideGuard],
    component: CampaignClimateOrgaComponent,
  },
  {
    path: "fiche/:lieu_id",
    component: CampaignFormPlaceComponent,
  },
  {
    path: "orga/:organization_id",
    canActivate: [AdminSoliguideGuard],
    component: CampaignManagePlacesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(campaignRoutes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {} // skipcq: JS-0327
