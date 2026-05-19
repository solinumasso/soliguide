import { ManageTradPlacesComponent } from "./components/manage-trad-places/manage-trad-places.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditTradFieldComponent } from "./components/edit-trad-field/edit-trad-field.component";

import { ManageTradFieldsComponent } from "./components/manage-trad-fields/manage-trad-fields.component";

export const manageRoutes: Routes = [
  {
    path: "",
    component: ManageTradFieldsComponent,
  },
  {
    path: "places",
    component: ManageTradPlacesComponent,
  },
  {
    path: "edit-field/:id/:lang",
    component: EditTradFieldComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(manageRoutes)],
  exports: [RouterModule],
})
export class TranslationsRoutingModule {} // skipcq: JS-0327
