import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminPlaceComponent } from "./components/admin-place/admin-place.component";
import { ManagePlacesComponent } from "./components/manage-places/manage-places.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";

export const adminPlaceRoutes: Routes = [
  {
    path: "search",
    canActivate: [AdminSoliguideGuard],
    component: ManagePlacesComponent,
  },
  {
    path: ":lieu_id",
    component: AdminPlaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminPlaceRoutes)],
  exports: [RouterModule],
})
export class AdminPlaceRoutingModule {} // skipcq: JS-0327
