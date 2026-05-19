import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { SoligareMatchingComponent } from "./components/soligare-matching/soligare-matching.component";
import { SoligarePairingComponent } from "./components/soligare-pairing/soligare-pairing.component";
import { SoligarePreviewComponent } from "./components/soligare-preview/soligare-preview.component";

export const soligareRoutes: Routes = [
  {
    path: "",
    canActivate: [AdminSoliguideGuard],
    component: SoligarePairingComponent,
  },
  {
    path: "matching/:source_id",
    canActivate: [AdminSoliguideGuard],
    component: SoligareMatchingComponent,
  },
  {
    path: "preview/:source_id",
    canActivate: [AdminSoliguideGuard],
    component: SoligarePreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(soligareRoutes)],
  exports: [RouterModule],
})
export class SoligareRoutingModule {} // skipcq: JS-0327
