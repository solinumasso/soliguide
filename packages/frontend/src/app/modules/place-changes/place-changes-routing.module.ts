import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlaceChangesPageComponent } from "./components/place-changes-page/place-changes-page.component";

import { CanReadChangeGuard } from "../../guards/can-read-change.guard";
import { ManagePlaceChangesComponent } from "./components/manage-place-changes/manage-place-changes.component";
import { CanEditGuard } from "../../guards/can-edit.guard";
import { PlaceHistoryComponent } from "./components/place-history/place-history.component";

export const ficheChangesRoutes: Routes = [
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManagePlaceChangesComponent,
  },
  {
    path: "place/:lieu_id",
    canActivate: [CanEditGuard],
    component: PlaceHistoryComponent,
  },
  {
    path: "version/:placeChangesObjectId",
    canActivate: [CanReadChangeGuard],
    component: PlaceChangesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ficheChangesRoutes)],
  exports: [RouterModule],
})
export class FicheChangesRoutingModule {} // skipcq: JS-0327
