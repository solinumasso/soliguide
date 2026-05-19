import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { PlaceComponent } from "./components/place/place.component";

export const placeRoutes: Routes = [
  {
    path: ":lieu_id",
    component: PlaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(placeRoutes)],
  exports: [RouterModule],
})
export class PlacePageRoutingModule {} // skipcq: JS-0327
